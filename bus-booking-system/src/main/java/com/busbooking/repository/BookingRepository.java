package com.busbooking.repository;

import com.busbooking.entity.Booking;
import com.busbooking.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

	List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);

    Optional<Booking> findByTicketNumber(String ticketNumber);

    long countByBusIdAndStatus(Long busId, BookingStatus status);

    @Query("SELECT COALESCE(MAX(b.seatNumber), 0) FROM Booking b WHERE b.bus.id = :busId")
    int findMaxSeatNumberByBusId(@Param("busId") Long busId);

    @Query("SELECT b.seatNumber FROM Booking b WHERE b.bus.id = :busId AND b.status = 'CONFIRMED'")
    List<Integer> findBookedSeatsByBusId(@Param("busId") Long busId);
}
