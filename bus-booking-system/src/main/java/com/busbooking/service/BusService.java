package com.busbooking.service;

import com.busbooking.dto.BusRequest;
import com.busbooking.entity.Bus;
import com.busbooking.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository busRepository;

    public Bus addBus(BusRequest request) {
        if (busRepository.existsByBusNumber(request.getBusNumber())) {
            throw new RuntimeException("Bus with number '" + request.getBusNumber() + "' already exists");
        }

        Bus bus = Bus.builder()
                .busNumber(request.getBusNumber())
                .busName(request.getBusName())
                .source(request.getSource())
                .destination(request.getDestination())
                .arrivalTime(request.getArrivalTime())
                .departureTime(request.getDepartureTime())
                .availableSeats(request.getAvailableSeats())
                .fare(request.getFare())
                .build();

        return busRepository.save(bus);
    }

    public Bus updateBus(Long id, BusRequest request) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + id));

        // Check if busNumber is being changed to an existing one
        busRepository.findByBusNumber(request.getBusNumber())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException("Bus number '" + request.getBusNumber() + "' is already in use");
                    }
                });

        bus.setBusNumber(request.getBusNumber());
        bus.setBusName(request.getBusName());
        bus.setSource(request.getSource());
        bus.setDestination(request.getDestination());
        bus.setArrivalTime(request.getArrivalTime());
        bus.setDepartureTime(request.getDepartureTime());
        bus.setAvailableSeats(request.getAvailableSeats());
        bus.setFare(request.getFare());

        return busRepository.save(bus);
    }

    public void deleteBus(Long id) {
        if (!busRepository.existsById(id)) {
            throw new RuntimeException("Bus not found with id: " + id);
        }
        busRepository.deleteById(id);
    }

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Bus getBusById(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + id));
    }
}
