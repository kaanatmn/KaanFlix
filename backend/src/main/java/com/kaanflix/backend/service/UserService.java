package com.kaanflix.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kaanflix.backend.entity.User;
import com.kaanflix.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    
    //Update username:
    public User updateUsername(Long userId, String newUsername) {
        // Find the user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found!"));

        // Check if new username already exists
        if (userRepository.existsByUsername(newUsername) && !user.getUsername().equals(newUsername)) {
            throw new RuntimeException("Username already taken!");
        }

        // Update username
        user.setUsername(newUsername);
        return userRepository.save(user);
    }

    
    //Update email (requires password verification):
    public User updateEmail(Long userId, String currentPassword, String newEmail) {
        // Find the user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found!"));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Incorrect password!");
        }

        // Check if new email already exists
        if (userRepository.existsByEmail(newEmail) && !user.getEmail().equals(newEmail)) {
            throw new RuntimeException("Email already in use!");
        }

        // Update email
        user.setEmail(newEmail);
        return userRepository.save(user);
    }

    
    //Update password (requires current password verification):
    public void updatePassword(Long userId, String currentPassword, String newPassword) {
        // Find the user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found!"));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Incorrect current password!");
        }

        // Validate new password 
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters!");
        }

        // Hash and save new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}