package com.kaanflix.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaanflix.backend.entity.ListLike;

public interface ListLikeRepository extends JpaRepository<ListLike, Long> {
    List<ListLike> findByUserId(Long userId);
    Optional<ListLike> findByUserIdAndMovieListId(Long userId, Long listId);
    boolean existsByUserIdAndMovieListId(Long userId, Long listId);
    long countByMovieListId(Long listId);
}