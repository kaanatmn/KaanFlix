package com.kaanflix.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaanflix.backend.entity.User;


public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find user by email (for login)
    Optional<User> findByUsername(String username);
    
    // Check if email exists (for sign up)
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
}
