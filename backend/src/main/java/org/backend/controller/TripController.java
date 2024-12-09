package org.backend.controller;

import lombok.RequiredArgsConstructor;
import org.backend.service.TripService;
import org.backend.dto.request.CreateTripRequest;
import org.backend.dto.response.TripResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/trips")
@RestController
@RequiredArgsConstructor
public class TripController {
    private final TripService tripService;
    @GetMapping
    public ResponseEntity<?>getAllTrips(){
        List<TripResponse> tripResponseList = tripService.findAll();
        return new ResponseEntity<>(tripResponseList, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id){
        TripResponse tripResponse = tripService.findById(id);
        return new ResponseEntity<>(tripResponse, HttpStatus.OK);
    }

    // @PreAuthorize("hasRole('Admin')")
    @PostMapping
    public ResponseEntity<?> createTrips(@RequestBody CreateTripRequest tripRequest){
        TripResponse tripResponse = tripService.createTrip(tripRequest);
        return new ResponseEntity<>(tripResponse, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(@PathVariable Long id, @RequestBody CreateTripRequest tripRequest) {
        TripResponse updatedTrip = tripService.updateTrip(id, tripRequest);
        return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
    }


}
