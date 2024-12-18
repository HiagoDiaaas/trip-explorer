package org.backend.dto.response;
import lombok.Data;

@Data
public class FavoriteResponse {
    private Long id;
    private Long tripId;
    private Long userId;

    public static FavoriteResponse from(Long favoriteId, Long tripId, Long userId) {
        FavoriteResponse response = new FavoriteResponse();
        response.setId(favoriteId);
        response.setTripId(tripId);
        response.setUserId(userId);
        return response;
    }
}
