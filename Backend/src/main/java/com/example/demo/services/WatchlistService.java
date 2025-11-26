package com.example.demo.services;

import com.example.demo.models.Watchlist;
import com.example.demo.repositories.WatchlistRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistService {

    @Autowired
    private WatchlistRepository watchlistRepo;

    @Autowired
    private UserRepository userRepo;

    // Get all items for the logged-in user
    public List<Watchlist> getUserWatchlist(Long userId) {
        return watchlistRepo.findByUserId(userId);
    }

    // Add a movie to user's watchlist
    public Watchlist addToWatchlist(Long userId, Integer movieId, String title, String poster) {

        // Prevent duplicates
        if (watchlistRepo.existsByUserIdAndMovieId(userId, movieId)) {
            throw new RuntimeException("Movie already in your watchlist");
        }

        Watchlist w = new Watchlist();
        w.setUserId(userId);
        w.setMovieId(movieId);   // FIXED NAME
        w.setTitle(title);
        w.setPoster(poster);

        return watchlistRepo.save(w);
    }

    // Remove item from watchlist
    public void remove(Long id, Long userId) {
        Watchlist item = watchlistRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        if (!item.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        watchlistRepo.delete(item);
    }
}
