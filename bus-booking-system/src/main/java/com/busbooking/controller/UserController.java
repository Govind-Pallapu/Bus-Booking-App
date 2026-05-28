package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.LoginRequest;
import com.busbooking.dto.UserRegistrationRequest;
import com.busbooking.dto.UserResponse;
import com.busbooking.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ─── POST /api/users/register ──────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody UserRegistrationRequest request) {

        UserResponse user = userService.register(request);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", user));
    }

    // ─── POST /api/users/login ─────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpSession session) {

        UserResponse user = userService.login(request, session);
        return ResponseEntity.ok(ApiResponse.success("Login successful", user));
    }

    // ─── POST /api/users/logout ────────────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpSession session) {
        userService.logout(session);
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    // ─── GET /api/users/profile ────────────────────────────────────────────────
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> profile(HttpSession session) {
        Long userId   = (Long)   session.getAttribute("userId");
        String name   = (String) session.getAttribute("userName");
        String role   = (String) session.getAttribute("userRole");

        UserResponse profile = UserResponse.builder()
                .id(userId)
                .name(name)
                .role(role)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Profile fetched", profile));
    }
    
 // ─── GET /api/admin/users ─── Get All Users (Admin Only) ──────────────────
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All users retrieved", users));
    }
    
}
