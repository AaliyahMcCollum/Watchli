package com.example.demo.controllers;

import com.example.demo.dto.RatingDTO;
import com.example.demo.models.Rating;
import com.example.demo.repositories.UserRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.services.RatingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<Rating> getAll(@RequestHeader("Authorization") String auth) {
        Long userId = extractUser(auth);
        return ratingService.getUserRatings(userId);
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<?> getForMovie(
            @PathVariable Integer movieId,
            @RequestHeader("Authorization") String auth) {

        Long userId = extractUser(auth);
        Rating review = ratingService.getUserMovieRating(userId, movieId);

        if (review == null) {
            return ResponseEntity.ok().body(null); 
            // DO NOT throw error
            // DO NOT say “movie not found”
        }

        return ResponseEntity.ok(review);
    }


    @PostMapping("/save")
    public ResponseEntity<?> save(
            @RequestHeader("Authorization") String auth,
            @RequestBody RatingDTO dto) {

        Long userId = extractUser(auth);

        Rating saved = ratingService.saveOrUpdateRating(
                userId,
                dto.getMovieId(),
                dto.getRating(),
                dto.getReviewTitle(),
                dto.getDescription(),
                dto.getPoster() // MUST MATCH SERVICE METHOD
        );

        return ResponseEntity.ok(saved);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String auth) {

        Long userId = extractUser(auth);
        ratingService.deleteRating(userId, id);

        return ResponseEntity.ok("Deleted");
    }

    // Extract userId from JWT
    private Long extractUser(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.getSubjectFromToken(token);

        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
