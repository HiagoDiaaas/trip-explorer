package org.backend.dto.response;

import lombok.Data;
import org.backend.domain.Trip;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class TripResponse {
    private Long id;
    private String country;
    private String airport;
    private String hotel;
    private List<String> galleryImages;

    public static TripResponse from(Trip trip){
        TripResponse tripResponse = new TripResponse();
        tripResponse.id= trip.getId();
        tripResponse.airport=trip.getAirport();
        tripResponse.country= trip.getCountry();
        tripResponse.hotel = trip.getHotel();

        if (trip.getGallery() != null) {
            tripResponse.galleryImages = trip.getGallery().stream()
                    .map(gallery -> gallery.getUrl())
                    .collect(Collectors.toList());
        }

        return tripResponse;
    }
}
