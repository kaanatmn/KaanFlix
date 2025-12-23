package com.kaanflix.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaanflix.backend.dto.UserDTO;
import com.kaanflix.backend.entity.User;
import com.kaanflix.backend.service.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Update Username
    @PutMapping("/update-username")
    public ResponseEntity<?> updateUsername(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String newUsername = (String) request.get("newUsername");
            
            if (newUsername == null || newUsername.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username cannot be empty!");
            }
            
            User updatedUser = userService.updateUsername(userId, newUsername.trim());
            return ResponseEntity.ok(UserDTO.fromUser(updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update Email (requires password verification)
    @PutMapping("/update-email")
    public ResponseEntity<?> updateEmail(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String currentPassword = (String) request.get("currentPassword");
            String newEmail = (String) request.get("newEmail");
            
            if (newEmail == null || newEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email cannot be empty!");
            }
            
            if (currentPassword == null || currentPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Current password is required!");
            }
            
            User updatedUser = userService.updateEmail(userId, currentPassword, newEmail.trim());
            return ResponseEntity.ok(UserDTO.fromUser(updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update Password (requires current password verification)
    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String currentPassword = (String) request.get("currentPassword");
            String newPassword = (String) request.get("newPassword");
            
            if (currentPassword == null || currentPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Current password is required!");
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("New password cannot be empty!");
            }
            
            userService.updatePassword(userId, currentPassword, newPassword);
            return ResponseEntity.ok("Password updated successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
