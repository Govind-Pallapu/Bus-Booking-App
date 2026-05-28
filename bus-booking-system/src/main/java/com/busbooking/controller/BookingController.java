package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.BookingRequest;
import com.busbooking.dto.TicketResponse;
import com.busbooking.service.BookingService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ─── POST /api/bookings/book ─── Book a Seat ──────────────────────────────
    @PostMapping("/book")
    public ResponseEntity<ApiResponse<TicketResponse>> bookSeat(
            @Valid @RequestBody BookingRequest request,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        TicketResponse ticket = bookingService.bookSeat(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Seat booked successfully! Your ticket is ready.", ticket));
    }

    // ─── POST /api/bookings/cancel/{ticketNumber} ─── Cancel Booking ──────────
    @PostMapping("/cancel/{ticketNumber}")
    public ResponseEntity<ApiResponse<TicketResponse>> cancelBooking(
            @PathVariable String ticketNumber,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        TicketResponse ticket = bookingService.cancelBooking(userId, ticketNumber);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", ticket));
    }

    // ─── GET /api/bookings/ticket/{ticketNumber} ─── View Ticket ──────────────
    @GetMapping("/ticket/{ticketNumber}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicket(
            @PathVariable String ticketNumber,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        TicketResponse ticket = bookingService.getTicket(userId, ticketNumber);
        return ResponseEntity.ok(ApiResponse.success("Ticket details", ticket));
    }

    // ─── GET /api/bookings/my-bookings ─── Get All Bookings ─
    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getMyBookings(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        List<TicketResponse> tickets = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(ApiResponse.success("Your bookings (" + tickets.size() + " total)", tickets));
    }
    
 // ─── GET /api/bookings/available-seats/{busId} ────────────────────────────
 
    @GetMapping("/available-seats/{busId}")
    public ResponseEntity<ApiResponse<List<Integer>>> getAvailableSeats(
            @PathVariable Long busId) {
        List<Integer> seats = bookingService.getAvailableSeats(busId);
        return ResponseEntity.ok(ApiResponse.success("Available seats", seats));
    }
    
   
}
