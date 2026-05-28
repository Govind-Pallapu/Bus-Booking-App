package com.busbooking.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;
    private final AdminInterceptor adminInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        // Protect user-specific actions (booking, search)
        registry.addInterceptor(authInterceptor)
                .addPathPatterns(
                        "/api/bookings/**",   // All booking routes
                        "/api/search/**",     // Search routes
                        "/api/users/logout",  // Logout
                        "/api/users/profile", // Profile
                        "/api/users/all"
                )
                .excludePathPatterns(
                        "/api/users/register",
                        "/api/users/login"
                );

        // Protect admin routes (add/update/delete buses)
        registry.addInterceptor(adminInterceptor)
                .addPathPatterns("/api/admin/**");
    }
}
