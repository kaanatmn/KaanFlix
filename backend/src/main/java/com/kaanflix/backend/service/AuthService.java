package com.kaanflix.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kaanflix.backend.entity.User;
import com.kaanflix.backend.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String username, String email, String password) {
        // 1. Check if user already exists
        if (userRepository.existsByEmail(email) || userRepository.existsByUsername(username)) {
            throw new RuntimeException("User already exists!");
        }

        // 2. Create new user
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        
        // 3. Hash the password before saving
        user.setPassword(passwordEncoder.encode(password));

        return userRepository.save(user);
    }

    public User loginUser(String username, String password) {
        // 1. Find user in DB
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found!"));

        // 2. Compare the raw password with the encrypted one in DB
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        return user;
    }
    
}