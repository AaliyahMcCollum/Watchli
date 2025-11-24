package com.example.demo.controllers;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.frontend.url}")  // allow your frontend origin
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        try {
            String token = authService.signup(req);
            return ResponseEntity.ok().body(new AuthResponse(token));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            String token = authService.login(req);
            return ResponseEntity.ok().body(new AuthResponse(token));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(401).body(ex.getMessage());
        }
    }

    // small inner DTO for response 
    public static class AuthResponse {
        private String token;
        public AuthResponse(String token) { this.token = token; }
        public String getToken() { return token; }
    }
}