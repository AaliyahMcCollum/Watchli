package com.example.demo.dto;

import lombok.Data;

@Data
public class RatingDTO {
    private Integer movieId;
    private Integer rating;
    private String reviewTitle;
    private String description;
    private String poster;
}
