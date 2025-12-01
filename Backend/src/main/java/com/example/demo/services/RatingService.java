package com.example.demo.services;

import com.example.demo.dto.RatingDTO;
import com.example.demo.models.Rating;
import com.example.demo.repositories.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepo;

    // Get all ratings for a user
    public List<Rating> getUserRatings(Long userId) {
        return ratingRepo.findByUserId(userId);
    }

    // Get rating for a specific movie
    public Rating getUserMovieRating(Long userId, Integer movieId) {
        return ratingRepo.findByUserIdAndMovieId(userId, movieId).orElse(null);
    }

    // CREATE or UPDATE rating
    public Rating saveOrUpdateRating(Long userId, Integer movieId, Integer rating,
                                     String reviewTitle, String description, String poster) {

        Rating existing = ratingRepo.findByUserIdAndMovieId(userId, movieId).orElse(null);

        if (existing == null) {
            Rating r = new Rating();
            r.setUserId(userId);
            r.setMovieId(movieId);
            r.setRating(rating);
            r.setReviewTitle(reviewTitle);
            r.setDescription(description);
            r.setPoster(poster);
            r.setUpdatedAt(LocalDateTime.now());
            return ratingRepo.save(r);
        }

        // Update existing review
        existing.setRating(rating);
        existing.setReviewTitle(reviewTitle);
        existing.setDescription(description);
        existing.setPoster(poster);
        existing.setUpdatedAt(LocalDateTime.now());

        return ratingRepo.save(existing);
    }

    // Delete rating
    public void deleteRating(Long userId, Long ratingId) {
        Rating r = ratingRepo.findById(ratingId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        if (!r.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        ratingRepo.delete(r);
    }
}
