package com.busbooking.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {

    @NotNull(message = "Bus ID is required")
    private Long busId;

    @NotBlank(message = "Passenger name is required")
    private String passengerName;

    @NotNull(message = "Journey date is required")
    @FutureOrPresent(message = "Journey date cannot be in the past")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate journeyDate;
    
    @NotNull(message = "Seat number is required")
    @Min(value = 1, message = "Seat number must be at least 1")
    private Integer seatNumber;       
}
