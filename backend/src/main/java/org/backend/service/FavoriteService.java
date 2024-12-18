package org.backend.service;
import org.backend.dto.request.CreateFavoriteRequest;
import org.backend.dto.response.FavoriteResponse;

import java.util.List;

public interface FavoriteService {
    FavoriteResponse addFavorite(CreateFavoriteRequest request);
    List<FavoriteResponse> getFavoritesByUser(Long userId);
    void removeFavorite(Long favoriteId, Long userId);
}