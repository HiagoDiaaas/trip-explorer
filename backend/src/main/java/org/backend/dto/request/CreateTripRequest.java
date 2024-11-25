package org.backend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateTripRequest {
    private String country;
    private String airport;
    private String hotel;
    private List<String> galleryImages;
}
