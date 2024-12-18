package org.backend.controller;
import lombok.RequiredArgsConstructor;
import org.backend.dto.request.CreateFavoriteRequest;
import org.backend.dto.response.FavoriteResponse;
import org.backend.service.FavoriteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/favorites")
@RestController
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<FavoriteResponse> addFavorite(@RequestBody CreateFavoriteRequest request) {
        FavoriteResponse response = favoriteService.addFavorite(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FavoriteResponse>> getFavoritesByUser(@PathVariable Long userId) {
        List<FavoriteResponse> favorites = favoriteService.getFavoritesByUser(userId);
        return new ResponseEntity<>(favorites, HttpStatus.OK);
    }

    @DeleteMapping("/{favoriteId}/user/{userId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long favoriteId, @PathVariable Long userId) {
        favoriteService.removeFavorite(favoriteId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
