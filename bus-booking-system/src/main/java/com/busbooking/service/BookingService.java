package com.busbooking.service;

import com.busbooking.dto.BookingRequest;
import com.busbooking.dto.TicketResponse;
import com.busbooking.entity.Booking;
import com.busbooking.entity.Bus;
import com.busbooking.entity.User;
import com.busbooking.enums.BookingStatus;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BusRepository busRepository;
    private final UserRepository userRepository;

    @Transactional
    public TicketResponse bookSeat(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + request.getBusId()));

        if (bus.getAvailableSeats() <= 0) {
            throw new RuntimeException("Sorry, no seats available on this bus");
        }

     // Check selected seat is not already booked
        List<Integer> bookedSeats = bookingRepository
                .findBookedSeatsByBusId(request.getBusId());

        if (bookedSeats.contains(request.getSeatNumber())) {
            throw new RuntimeException("Seat " + request.getSeatNumber() +
                    " is already booked. Please select another seat.");
        }

        int assignedSeatNumber = request.getSeatNumber();

        // Generate unique ticket number
        String ticketNumber = "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Booking booking = Booking.builder()
                .user(user)
                .bus(bus)
                .passengerName(request.getPassengerName())
                .seatNumber(assignedSeatNumber)
                .journeyDate(request.getJourneyDate())
                .ticketNumber(ticketNumber)
                .status(BookingStatus.CONFIRMED)
                .bookedAt(LocalDateTime.now())
                .build();

        // Decrease available seats by 1
        bus.setAvailableSeats(bus.getAvailableSeats() - 1);
        busRepository.save(bus);

        Booking saved = bookingRepository.save(booking);
        return mapToTicketResponse(saved);
    }

    @Transactional
    public TicketResponse cancelBooking(Long userId, String ticketNumber) {
        Booking booking = bookingRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketNumber));

        // Ensure the ticket belongs to the logged-in user
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to cancel this ticket");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("This ticket is already cancelled");
        }

        // Cancel the booking
        booking.setStatus(BookingStatus.CANCELLED);

        // Restore seat count
        Bus bus = booking.getBus();
        bus.setAvailableSeats(bus.getAvailableSeats() + 1);
        busRepository.save(bus);

        Booking updated = bookingRepository.save(booking);
        return mapToTicketResponse(updated);
    }

    public TicketResponse getTicket(Long userId, String ticketNumber) {
        Booking booking = bookingRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketNumber));

        // Only the owner can view their ticket
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to view this ticket");
        }

        return mapToTicketResponse(booking);
    }

    public List<TicketResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByBookedAtDesc(userId)
                .stream()
                .map(this::mapToTicketResponse)
                .collect(Collectors.toList());
    }

    private TicketResponse mapToTicketResponse(Booking booking) {
        Bus bus = booking.getBus();
        return TicketResponse.builder()
                .ticketNumber(booking.getTicketNumber())
                .passengerName(booking.getPassengerName())
                .busNumber(bus.getBusNumber())
                .busName(bus.getBusName())
                .seatNumber(booking.getSeatNumber())
                .journeyDate(booking.getJourneyDate())
                .fromPlace(bus.getSource())
                .toPlace(bus.getDestination())
                .departureTime(bus.getDepartureTime())
                .arrivalTime(bus.getArrivalTime())
                .fare(bus.getFare())
                .status(booking.getStatus().name())
                .bookedAt(booking.getBookedAt())
                .build();
    }
    
    public List<Integer> getAvailableSeats(Long busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + busId));

        List<Integer> bookedSeats = bookingRepository.findBookedSeatsByBusId(busId);
        int totalCapacity = bus.getAvailableSeats() + bookedSeats.size();

        List<Integer> availableSeats = new ArrayList<>();
        for (int i = 1; i <= totalCapacity; i++) {
            if (!bookedSeats.contains(i)) {
                availableSeats.add(i);
            }
        }
        return availableSeats;
    }

}
