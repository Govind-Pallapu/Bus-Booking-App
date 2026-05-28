package com.busbooking.service;

import com.busbooking.dto.LoginRequest;
import com.busbooking.dto.UserRegistrationRequest;
import com.busbooking.dto.UserResponse;
import com.busbooking.entity.User;
import com.busbooking.enums.Role;
import com.busbooking.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse register(UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }
        if (userRepository.existsByName(request.getName())) {
            throw new RuntimeException("Username is already taken");
        }

      
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .phoneNumber(request.getPhoneNumber())
                .role(Role.USER)
                .build();

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    public UserResponse login(LoginRequest request, HttpSession session) {
        User user = userRepository.findByNameAndPassword(request.getName(), request.getPassword())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        // Store user info in session
        session.setAttribute("userId", user.getId());
        session.setAttribute("userName", user.getName());
        session.setAttribute("userRole", user.getRole().name());

        return mapToResponse(user);
    }

    public void logout(HttpSession session) {
        session.invalidate();
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .build();
    }
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
