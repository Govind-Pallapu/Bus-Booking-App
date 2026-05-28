package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.BusRequest;
import com.busbooking.entity.Bus;
import com.busbooking.service.BusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/buses")
@RequiredArgsConstructor
public class AdminBusController {

    private final BusService busService;

    // ─── POST /api/admin/buses ─── Add Bus ────────────────────────────────────
    @PostMapping
    public ResponseEntity<ApiResponse<Bus>> addBus(@Valid @RequestBody BusRequest request) {
        Bus bus = busService.addBus(request);
        return ResponseEntity.ok(ApiResponse.success("Bus added successfully", bus));
    }

    // ─── PUT /api/admin/buses/{id} ─── Update Bus ─────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Bus>> updateBus(
            @PathVariable Long id,
            @Valid @RequestBody BusRequest request) {

        Bus bus = busService.updateBus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Bus updated successfully", bus));
    }

    // ─── DELETE /api/admin/buses/{id} ─── Delete Bus ──────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return ResponseEntity.ok(ApiResponse.success("Bus deleted successfully", null));
    }

    // ─── GET /api/admin/buses ─── Get All Buses ────────────────────────────────
    @GetMapping
    public ResponseEntity<ApiResponse<List<Bus>>> getAllBuses() {
        List<Bus> buses = busService.getAllBuses();
        return ResponseEntity.ok(ApiResponse.success("All buses retrieved", buses));
    }

    // ─── GET /api/admin/buses/{id} ─── Get Bus by ID ──────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Bus>> getBusById(@PathVariable Long id) {
        Bus bus = busService.getBusById(id);
        return ResponseEntity.ok(ApiResponse.success("Bus retrieved", bus));
    }
}
