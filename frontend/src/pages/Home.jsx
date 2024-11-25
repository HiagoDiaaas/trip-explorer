import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";

import { fetchTrips } from "../features/trips/tripsSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { trips, isLoading, error } = useSelector((state) => state.trips);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const handleCardClick = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  if (isLoading) return <div>Loading trips...</div>;

  if (error) return <div>Error fetching trips..</div>;

  return (
    <Box display="flex" flexWrap="wrap" gap={3} m={3} className="container">
      {trips?.map((trip) => (
        <Box key={trip.id} onClick={() => handleCardClick(trip.id)}>
          <Card country={trip.country} galleryImages={trip.galleryImages} />
        </Box>
      ))}
    </Box>
  );
};

export default Home;
