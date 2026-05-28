package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.BusSearchResponse;
import com.busbooking.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    // ─── GET /api/search/buses?from= ──────────────────────
    @GetMapping("/buses")
    public ResponseEntity<ApiResponse<List<BusSearchResponse>>> searchBuses(
            @RequestParam String from,
            @RequestParam String to) {

        if (from.isBlank() || to.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("'from' and 'to' parameters are required"));
        }

        List<BusSearchResponse> results = searchService.searchBuses(from, to);

        if (results.isEmpty()) {
            return ResponseEntity.ok(
                    ApiResponse.success("No buses available for route: " + from + " → " + to, results)
            );
        }

        return ResponseEntity.ok(
                ApiResponse.success(results.size() + " bus(es) found for " + from + " → " + to, results)
        );
    }
}
