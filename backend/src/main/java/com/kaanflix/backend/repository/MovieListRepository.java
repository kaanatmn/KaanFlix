package com.kaanflix.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaanflix.backend.entity.MovieList;

public interface MovieListRepository extends JpaRepository<MovieList, Long> {
    List<MovieList> findByUserId(Long userId);
    List<MovieList> findByIsPublicTrue();
    List<MovieList> findByUserIdAndIsPublicTrue(Long userId);
}