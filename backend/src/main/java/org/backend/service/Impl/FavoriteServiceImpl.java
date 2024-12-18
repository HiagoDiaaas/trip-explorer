package org.backend.service.Impl;
import lombok.RequiredArgsConstructor;
import org.backend.domain.Favorite;
import org.backend.domain.Trip;
import org.backend.domain.User;
import org.backend.dto.request.CreateFavoriteRequest;
import org.backend.dto.response.FavoriteResponse;
import org.backend.repository.FavoriteRepository;
import org.backend.repository.TripRepository;
import org.backend.repository.UserRepository;
import org.backend.service.FavoriteService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final TripRepository tripRepository;

    @Override
    public FavoriteResponse addFavorite(CreateFavoriteRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + request.getUserId()));
        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new IllegalArgumentException("Trip not found with id: " + request.getTripId()));

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setTrip(trip);
        Favorite saved = favoriteRepository.save(favorite);

        return FavoriteResponse.from(saved.getId(), trip.getId(), user.getId());
    }

    @Override
    public List<FavoriteResponse> getFavoritesByUser(Long userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        return favorites.stream()
                .map(f -> FavoriteResponse.from(f.getId(), f.getTrip().getId(), f.getUser().getId()))
                .collect(Collectors.toList());
    }

    @Override
    public void removeFavorite(Long favoriteId, Long userId) {
        Favorite favorite = favoriteRepository.findById(favoriteId)
                .orElseThrow(() -> new IllegalArgumentException("Favorite not found with id: " + favoriteId));
        if (!favorite.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not the owner of this favorite");
        }
        favoriteRepository.delete(favorite);
    }
}
