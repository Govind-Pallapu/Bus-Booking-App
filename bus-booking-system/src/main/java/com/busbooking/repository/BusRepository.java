package com.busbooking.repository;

import com.busbooking.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {

    Optional<Bus> findByBusNumber(String busNumber);

    List<Bus> findBySourceIgnoreCaseAndDestinationIgnoreCase(String source, String destination);

    boolean existsByBusNumber(String busNumber);
}
