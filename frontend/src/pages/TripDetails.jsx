import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { findTripById, removeTrip } from "../features/trips/tripsSlice";
import defaultImage from "../images/default.png";

import "./TripDetails.css";

const TripDetails = ({ isLoggedIn }) => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const trip = useSelector((state) => state.trips.selectedTrip);
  const isLoading = useSelector((state) => state.trips.isLoading);

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const [successMessage, setSuccessMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    dispatch(findTripById(parseInt(tripId)));
  }, [dispatch, tripId]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userId && token) {
        const response = await fetch(`http://localhost:4000/api/v1/favorites/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const fav = data.find(fav => fav.tripId === parseInt(tripId));
          if (fav) {
            setIsFavorite(true);
            setFavoriteId(fav.id);
          } else {
            setIsFavorite(false);
            setFavoriteId(null);
          }
        }
      }
    };

    fetchFavorites();
  }, [tripId, userId, token]);

  const handleDeleteTrip = async () => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        const response = await fetch(
          `http://localhost:4000/api/v1/trips/${tripId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          alert("Trip deleted successfully.");
          dispatch(removeTrip(parseInt(tripId)));
          navigate("/");
        } else {
          let errorMessage = "Failed to delete trip.";
          if (response.status === 404) {
            errorMessage = "Trip not found.";
          } else {
            const errorText = await response.text();
            errorMessage += ` ${errorText}`;
          }
          console.error("Error deleting trip:", errorMessage);
          alert(errorMessage);
        }
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    }
  };

  const handleEditTrip = () => {
    navigate(`/trip/${tripId}/edit`);
  };

  const handleTripUpdated = () => {
    setSuccessMessage("Trip was updated successfully.");
  };

  const toggleFavorite = async () => {
    console.log("Toggle favorite called");
    console.log("Trip ID:", tripId, "typeof:", typeof tripId);
    console.log("User ID:", userId, "typeof:", typeof userId);
    console.log("Token:", token);
    console.log("Is Favorite:", isFavorite);
    console.log("Favorite ID:", favoriteId);

    const parsedTripId = parseInt(tripId);
    const parsedUserId = parseInt(userId);

    console.log("Parsed Trip ID:", parsedTripId, "typeof:", typeof parsedTripId);
    console.log("Parsed User ID:", parsedUserId, "typeof:", typeof parsedUserId);

    if (!parsedUserId || isNaN(parsedUserId)) {
      alert("User ID is not valid. Check login response and ensure userId is a number.");
      return;
    }

    if (!parsedTripId || isNaN(parsedTripId)) {
      alert("Trip ID is not valid.");
      return;
    }

    if (isFavorite && favoriteId) {
      // Remove from favorites
      const response = await fetch(`http://localhost:4000/api/v1/favorites/${favoriteId}/user/${parsedUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Remove from favorites response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error removing from favorites:", errorText);
        alert(`Failed to remove from favorites: ${errorText}`);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
        console.log("Successfully removed from favorites");
      }

    } else {
      // Add to favorites
      console.log("Adding to favorites with body:", { tripId: parsedTripId, userId: parsedUserId });
      const response = await fetch(`http://localhost:4000/api/v1/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tripId: parsedTripId, userId: parsedUserId })
      });

      console.log("Add to favorites response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error adding to favorites:", errorText);
        alert(`Failed to add to favorites: ${errorText}`);
      } else {
        const data = await response.json();
        console.log("Successfully added to favorites:", data);
        setIsFavorite(true);
        setFavoriteId(data.id);
      }
    }
  };

  if (isLoading) return <div>Loading trip details...</div>;

  if (!trip) return <div>No trip details found</div>;

  const imageUrl =
    trip?.galleryImages?.length > 0 ? trip.galleryImages[0] : defaultImage;

  return (
    <div className="container">
      <div className="content">
        <div>
          <img
            src={imageUrl}
            alt={trip.country || "No Country"}
            width="600"
            height="400"
          />
        </div>

        <div>
          <h1>{trip.country}</h1>
          <p><span>Airport:</span> {trip.airport}</p>
          <p><span>Hotel:</span> {trip.hotel}</p>

          {isLoggedIn && (
            <div style={{ marginTop: "16px" }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteTrip}
                sx={{ mt: 2, mr: 2 }}
              >
                Delete Trip
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditTrip}
                sx={{ mt: 2, mr: 2 }}
              >
                Edit Trip
              </Button>
              <Button
                variant="contained"
                color={isFavorite ? "secondary" : "success"}
                onClick={toggleFavorite}
                sx={{ mt: 2 }}
              >
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {successMessage && (
        <Typography sx={{ mt: 4, color: "green", textAlign: "center" }}>
          {successMessage}
        </Typography>
      )}

      <div className="gallery">
        {trip.galleryImages && trip.galleryImages.length > 0 ? (
          trip.galleryImages.map((url, index) => (
            <img
              key={index}
              src={url || defaultImage}
              alt={`Gallery ${index + 1}`}
              width={300}
              height={200}
            />
          ))
        ) : (
          <p>No gallery images available.</p>
        )}
      </div>
    </div>
  );
};

export default TripDetails;