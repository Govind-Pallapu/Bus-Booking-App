package com.busbooking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "buses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String busNumber;

    @Column(nullable = false)
    private String busName;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    private LocalTime arrivalTime;

    private LocalTime departureTime;

    @Column(nullable = false)
    private int availableSeats;

    @Column(nullable = false)
    private double fare;
}
