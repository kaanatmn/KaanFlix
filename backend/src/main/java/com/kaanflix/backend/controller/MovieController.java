package com.kaanflix.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaanflix.backend.service.TmdbService;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:5173") // Allows React (Vite) to access this
public class MovieController {

    private final TmdbService tmdbService;

    public MovieController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/popular")
    public ResponseEntity<String> getPopularMovies() {
        return ResponseEntity.ok(tmdbService.getPopularMovies());
    }

    @GetMapping("/search")
    public ResponseEntity<String> searchMovies(@org.springframework.web.bind.annotation.RequestParam String query) {
        // This handles GET /api/movies/search?query=Batman
        return ResponseEntity.ok(tmdbService.searchMovies(query));
    }
}


