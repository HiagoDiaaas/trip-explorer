import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../features/favorites/favoritesSlice";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { favorites, isLoading, error } = useSelector((state) => state.favorites);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const [favoriteTrips, setFavoriteTrips] = useState([]);

  useEffect(() => {
    if (userId && token) {
      dispatch(fetchFavorites({ userId, token }));
    }
  }, [dispatch, userId, token]);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (favorites.length > 0 && token) {
        const fetchedTrips = [];
        for (const fav of favorites) {
          const res = await fetch(`http://localhost:4000/api/v1/trips/${fav.tripId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (res.ok) {
            const trip = await res.json();
            fetchedTrips.push({ ...trip, favoriteId: fav.id });
          }
        }
        setFavoriteTrips(fetchedTrips);
      } else {
        setFavoriteTrips([]);
      }
    };
    fetchTripDetails();
  }, [favorites, token]);

  const handleCardClick = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  if (!token) {
    return <div>Please log in to view favorites.</div>;
  }

  if (isLoading) return <div>Loading favorite trips...</div>;

  if (error) return <div>Error fetching favorites: {error}</div>;

  if (favorites.length === 0) return <div>No favorite trips found.</div>;

  return (
    <Box display="flex" flexWrap="wrap" gap={3} m={3} className="container">
      {favoriteTrips.map((trip, index) => (
        <Box key={index} onClick={() => handleCardClick(trip.id)}>
          <Card country={trip.country} galleryImages={trip.galleryImages} />
        </Box>
      ))}
    </Box>
  );
};

export default FavoritesPage;