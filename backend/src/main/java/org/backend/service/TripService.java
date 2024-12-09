package org.backend.service;

import org.backend.dto.request.CreateTripRequest;
import org.backend.dto.response.TripResponse;

import java.util.List;

public interface TripService {
    List<TripResponse> findAll();

    TripResponse findById(Long tripId);

    TripResponse createTrip(CreateTripRequest tripRequest);

    TripResponse updateTrip(Long tripId, CreateTripRequest tripRequest);

    void deleteTrip(Long tripId);
}
