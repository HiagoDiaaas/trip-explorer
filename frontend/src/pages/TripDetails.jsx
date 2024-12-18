import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, TextField } from "@mui/material";
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

  const [notes, setNotes] = useState([]);
  const [newNoteContent, setNewNoteContent] = useState("");

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


  useEffect(() => {
    const fetchNotes = async () => {
      if (userId && token && isLoggedIn) {
        const response = await fetch(`http://localhost:4000/api/v1/notes/user/${userId}/trip/${tripId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNotes(data);
        } else {
          console.error("Failed to fetch notes");
        }
      }
    };

    fetchNotes();
  }, [tripId, userId, token, isLoggedIn]);

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
    const parsedTripId = parseInt(tripId);
    const parsedUserId = parseInt(userId);

    if (isFavorite && favoriteId) {
      const response = await fetch(`http://localhost:4000/api/v1/favorites/${favoriteId}/user/${parsedUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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
      const response = await fetch(`http://localhost:4000/api/v1/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tripId: parsedTripId, userId: parsedUserId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error adding to favorites:", errorText);
        alert(`Failed to add to favorites: ${errorText}`);
      } else {
        const data = await response.json();
        setIsFavorite(true);
        setFavoriteId(data.id);
      }
    }
  };


  const handleAddNote = async () => {
    if (!userId || !token || !newNoteContent.trim()) {
      alert("You must be logged in and note must not be empty.");
      return;
    }

    const parsedTripId = parseInt(tripId);
    const parsedUserId = parseInt(userId);

    const response = await fetch(`http://localhost:4000/api/v1/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ tripId: parsedTripId, userId: parsedUserId, content: newNoteContent.trim() })
    });

    if (response.ok) {
      const data = await response.json();
      setNotes((prevNotes) => [...prevNotes, data]);
      setNewNoteContent("");
    } else {
      alert("Failed to add note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!userId || !token) return;

    const parsedUserId = parseInt(userId);
    const response = await fetch(`http://localhost:4000/api/v1/notes/${noteId}/user/${parsedUserId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } else {
      alert("Failed to delete note");
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

          {/* Notes Section */}
          {isLoggedIn && (
            <div style={{ marginTop: "30px" }}>
              <h2>Notes</h2>
              <TextField
                label="Add a note"
                fullWidth
                multiline
                minRows={2}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="success" onClick={handleAddNote}>
                Add Note
              </Button>

              {notes.length > 0 ? (
                <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
                  {notes.map((note) => (
                    <li key={note.id} style={{ marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ flexGrow: 1 }}>
                          {note.content}
                        </div>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteNote(note.id)}
                          sx={{ ml: 2 }}
                        >
                          Delete Note
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notes yet.</p>
              )}
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