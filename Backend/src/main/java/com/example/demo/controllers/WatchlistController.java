package com.example.demo.controllers;

import com.example.demo.dto.AddWatchlistDTO;
import com.example.demo.models.Watchlist;
import com.example.demo.repositories.UserRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.services.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    // --------------------------------
    // GET WATCHLIST
    // --------------------------------
    @GetMapping
    public List<Watchlist> getUserWatchlist(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromAuth(authHeader);
        return watchlistService.getUserWatchlist(userId);
    }

    // --------------------------------
    // ADD TO WATCHLIST
    // --------------------------------
    @PostMapping("/add")
    public ResponseEntity<?> addWatchlistItem(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody AddWatchlistDTO body) {

        Long userId = getUserIdFromAuth(authHeader);

        Watchlist saved = watchlistService.addToWatchlist(
                userId,
                body.getMovieId(),
                body.getTitle(),
                body.getPoster()
        );

        return ResponseEntity.ok(saved);
    }


    // --------------------------------
    // DELETE FROM WATCHLIST
    // --------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = getUserIdFromAuth(authHeader);

        watchlistService.remove(id, userId);

        return ResponseEntity.ok("Removed from watchlist");
    }

    // --------------------------------
    // HELPER: Extract userId from token
    // --------------------------------
    private Long getUserIdFromAuth(String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer "
        String email = jwtUtil.getSubjectFromToken(token);

        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
