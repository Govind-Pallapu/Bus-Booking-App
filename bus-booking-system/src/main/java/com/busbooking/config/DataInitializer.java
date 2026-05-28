package com.busbooking.config;

import com.busbooking.entity.User;
import com.busbooking.enums.Role;
import com.busbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!userRepository.existsByName("admin")) {
            User admin = User.builder()
                    .name("admin")
                    .email("admin@busbooking.com")
                    .password("admin123")
                    .phoneNumber("9999999999")
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);
            log.info("========================================");
            log.info("  Default Admin Created:");
            log.info("  Username : admin");
            log.info("  Password : admin123");
            log.info("========================================");
        }
    }
}
