package com.busbooking.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponse {

    private String ticketNumber;
    private String passengerName;
    private String busNumber;
    private String busName;
    private int seatNumber;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate journeyDate;

    private String fromPlace;
    private String toPlace;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime departureTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime arrivalTime;

    private double fare;
    private String status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime bookedAt;
}
