package com.kaanflix.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kaanflix.backend.entity.MovieList;
import com.kaanflix.backend.entity.MovieListItem;
import com.kaanflix.backend.service.MovieListService;

@RestController
@RequestMapping("/api/lists")
@CrossOrigin(origins = "http://localhost:5173")
public class MovieListController {

    private final MovieListService movieListService;

    public MovieListController(MovieListService movieListService) {
        this.movieListService = movieListService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createList(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String name = (String) request.get("name");
            String description = (String) request.get("description");
            Boolean isPublic = (Boolean) request.get("isPublic");

            MovieList list = movieListService.createList(userId, name, description, isPublic);
            return ResponseEntity.ok(list);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserLists(@PathVariable Long userId) {
        try {
            List<Map<String, Object>> lists = movieListService.getUserLists(userId);
            return ResponseEntity.ok(lists);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/public")
    public ResponseEntity<?> getPublicLists(@RequestParam Long currentUserId) {
        try {
            List<Map<String, Object>> lists = movieListService.getPublicLists(currentUserId);
            return ResponseEntity.ok(lists);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/liked/{userId}")
    public ResponseEntity<?> getLikedLists(@PathVariable Long userId) {
        try {
            List<Map<String, Object>> lists = movieListService.getLikedLists(userId);
            return ResponseEntity.ok(lists);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{listId}")
    public ResponseEntity<?> getListById(@PathVariable Long listId) {
        try {
            Map<String, Object> list = movieListService.getListById(listId);
            return ResponseEntity.ok(list);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/add-movie")
    public ResponseEntity<?> addMovieToList(@RequestBody Map<String, Object> request) {
        try {
            Long listId = Long.valueOf(request.get("listId").toString());
            Long tmdbMovieId = Long.valueOf(request.get("tmdbMovieId").toString());
            String movieTitle = (String) request.get("movieTitle");
            String posterPath = (String) request.get("posterPath");

            MovieListItem item = movieListService.addMovieToList(listId, tmdbMovieId, movieTitle, posterPath);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/remove-movie/{itemId}")
    public ResponseEntity<?> removeMovieFromList(@PathVariable Long itemId, @RequestParam Long userId) {
        try {
            movieListService.removeMovieFromList(itemId, userId);
            return ResponseEntity.ok("Movie removed from list!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/like")
    public ResponseEntity<?> likeList(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long listId = Long.valueOf(request.get("listId").toString());

            movieListService.likeList(userId, listId);
            return ResponseEntity.ok("List liked!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/unlike")
    public ResponseEntity<?> unlikeList(@RequestParam Long userId, @RequestParam Long listId) {
        try {
            movieListService.unlikeList(userId, listId);
            return ResponseEntity.ok("List unliked!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{listId}")
    public ResponseEntity<?> deleteList(@PathVariable Long listId, @RequestParam Long userId) {
        try {
            movieListService.deleteList(listId, userId);
            return ResponseEntity.ok("List deleted!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}