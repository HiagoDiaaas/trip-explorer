import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { findTripById, removeTrip } from "../features/trips/tripsSlice";

import "./TripDetails.css";
import defaultImage from "../images/default.png";

const TripDetails = ({ isLoggedIn }) => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const trip = useSelector((state) => state.trips.selectedTrip);
  const isLoading = useSelector((state) => state.trips.isLoading);

  useEffect(() => {
    dispatch(findTripById(parseInt(tripId)));
  }, [dispatch, tripId]);

  const imageUrl =
    trip?.galleryImages?.length > 0 ? trip.galleryImages[0] : defaultImage;

  const handleDeleteTrip = async () => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        const response = await fetch(
          `http://localhost:4000/api/v1/trips/${tripId}`,
          {
            method: "DELETE"
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

  if (isLoading) return <div>Loading trip details...</div>;

  if (!trip) return <div>No trip details found</div>;

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
          <p>
            <span>Airport:</span> {trip.airport}
          </p>
          <p>
            <span>Hotel:</span> {trip.hotel}
          </p>

          {isLoggedIn && (
            <div style={{ marginTop: "16px" }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteTrip}
                sx={{ mt: 2 }}>
                Delete Trip
              </Button>
            </div>
          )}
        </div>
      </div>

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
