package org.backend.dto.request;
import lombok.Data;

@Data
public class CreateFavoriteRequest {
    private Long tripId;
    private Long userId;
}
