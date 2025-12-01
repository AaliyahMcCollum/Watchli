package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "movie_id", nullable = false)
    private Integer movieId;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "review_title")
    private String reviewTitle;

    @Column(name = "poster", columnDefinition = "text")
    private String poster;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "user_id", nullable = false)
    private Long userId;
}
