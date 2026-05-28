package com.busbooking.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusSearchResponse {

    private Long id;
    private String busNumber;
    private String busName;
    private String source;
    private String destination;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime departureTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime arrivalTime;

    private int availableSeats;
    private double fare;
}
