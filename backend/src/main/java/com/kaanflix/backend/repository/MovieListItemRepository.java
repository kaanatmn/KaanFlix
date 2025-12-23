package com.kaanflix.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaanflix.backend.entity.MovieListItem;

public interface MovieListItemRepository extends JpaRepository<MovieListItem, Long> {
    List<MovieListItem> findByMovieListId(Long listId);
    Optional<MovieListItem> findByMovieListIdAndTmdbMovieId(Long listId, Long tmdbMovieId);
    boolean existsByMovieListIdAndTmdbMovieId(Long listId, Long tmdbMovieId);
}
