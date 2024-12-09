package org.backend.service.Impl;

import lombok.RequiredArgsConstructor;
import org.backend.Exceptions.TripNotFoundException;
import org.backend.domain.Gallery;
import org.backend.domain.Trip;
import org.backend.dto.request.CreateTripRequest;
import org.backend.dto.response.TripResponse;
import org.backend.repository.TripRepository;
import org.backend.service.TripService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;

    @Override
    public List<TripResponse> findAll() {
        List<Trip> trips = tripRepository.findAll();
        List<TripResponse> tripResponses = new ArrayList<>();
        for (Trip trip : trips) {
            tripResponses.add(TripResponse.from(trip));
        }
        return tripResponses;
    }

    @Override
    public TripResponse findById(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new TripNotFoundException("Trip not found with id: " + tripId));
        return TripResponse.from(trip);
    }

    @Override
    public TripResponse createTrip(CreateTripRequest tripRequest) {
        Trip trip = new Trip();
        trip.setCountry(tripRequest.getCountry());
        trip.setAirport(tripRequest.getAirport());
        trip.setHotel(tripRequest.getHotel());

        List<Gallery> galleries = new ArrayList<>();
        if (tripRequest.getGalleryImages() != null) {
            for (String imageUrl : tripRequest.getGalleryImages()) {
                if (!imageUrl.isEmpty()) {
                    Gallery gallery = new Gallery();
                    gallery.setUrl(imageUrl);
                    gallery.setTrip(trip);
                    galleries.add(gallery);
                }
            }
        }
        trip.setGallery(galleries);

        Trip savedTrip = tripRepository.save(trip);

        return TripResponse.from(savedTrip);
    }

    @Override
    public void deleteTrip(Long tripId) {
        if (!tripRepository.existsById(tripId)) {
            throw new TripNotFoundException("Trip not found with id: " + tripId);
        }
        tripRepository.deleteById(tripId);
    }

    @Override
    public TripResponse updateTrip(Long tripId, CreateTripRequest tripRequest) {
        Trip existingTrip = tripRepository.findById(tripId)
                .orElseThrow(() -> new TripNotFoundException("Trip not found with id: " + tripId));

        existingTrip.setCountry(tripRequest.getCountry());
        existingTrip.setAirport(tripRequest.getAirport());
        existingTrip.setHotel(tripRequest.getHotel());

        List<Gallery> updatedGalleries = new ArrayList<>();
        if (tripRequest.getGalleryImages() != null) {
            for (String imageUrl : tripRequest.getGalleryImages()) {
                if (!imageUrl.isEmpty()) {
                    Gallery gallery = new Gallery();
                    gallery.setUrl(imageUrl);
                    gallery.setTrip(existingTrip);
                    updatedGalleries.add(gallery);
                }
            }
        }

        existingTrip.getGallery().clear();
        existingTrip.getGallery().addAll(updatedGalleries);

        Trip updatedTrip = tripRepository.save(existingTrip);

        return TripResponse.from(updatedTrip);
    }
}
