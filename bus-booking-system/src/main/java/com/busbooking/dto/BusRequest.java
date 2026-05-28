package com.busbooking.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusRequest {

    @NotBlank(message = "Bus number is required")
    private String busNumber;

    @NotBlank(message = "Bus name is required")
    private String busName;

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Arrival time is required")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime arrivalTime;

    @NotNull(message = "Departure time is required")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime departureTime;

    @Min(value = 1, message = "Available seats must be at least 1")
    private int availableSeats;

    @DecimalMin(value = "0.0", inclusive = false, message = "Fare must be greater than 0")
    private double fare;
}
