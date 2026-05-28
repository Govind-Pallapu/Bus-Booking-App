package com.busbooking.service;

import com.busbooking.dto.BusSearchResponse;
import com.busbooking.entity.Bus;
import com.busbooking.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final BusRepository busRepository;

    public List<BusSearchResponse> searchBuses(String from, String to) {
        List<Bus> buses = busRepository.findBySourceIgnoreCaseAndDestinationIgnoreCase(from, to);

        return buses.stream()
                .filter(bus -> bus.getAvailableSeats() > 0) // Only show buses with seats
                .map(this::mapToSearchResponse)
                .collect(Collectors.toList());
    }

    private BusSearchResponse mapToSearchResponse(Bus bus) {
        return BusSearchResponse.builder()
                .id(bus.getId())
                .busNumber(bus.getBusNumber())
                .busName(bus.getBusName())
                .source(bus.getSource())
                .destination(bus.getDestination())
                .departureTime(bus.getDepartureTime())
                .arrivalTime(bus.getArrivalTime())
                .availableSeats(bus.getAvailableSeats())
                .fare(bus.getFare())
                .build();
    }
}
