import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, TextField, Snackbar, Alert } from "@mui/material";

const AddGallery = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState("");
    const [gallery, setGallery] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [newImageUrl, setNewImageUrl] = useState("");

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await fetch(`http://localhost:4000/trips/${tripId}`);
                const data = await response.json();
                setGallery(data.data.gallery || []);
            } catch (error) {
                console.error("Error fetching gallery:", error);
            }
        };

        fetchGallery();
    }, [tripId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:4000/trips/${tripId}/gallery`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: imageUrl }),
            });

            if (response.ok) {
                setOpenSnackbar(true);
                const updatedGallery = await response.json();
                setGallery(updatedGallery.data.gallery || []);
            } else {
                console.error("Failed to add image to gallery");
            }
        } catch (error) {
            console.error("Error adding image:", error);
        }
    };

    const handleDeleteImage = async (url) => {
        try {
            const response = await fetch(`http://localhost:4000/trips/${tripId}/gallery`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            if (response.ok) {
                const updatedGallery = await response.json();
                setGallery(updatedGallery.data.gallery || []);
                setOpenSnackbar(true); // Show the snackbar after deletion
            } else {
                console.error("Failed to delete image");
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    const handleEditImage = (url) => {
        setEditingImage(url);
        setNewImageUrl(url);
    };

    const handleUpdateImage = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:4000/trips/${tripId}/gallery`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ oldUrl: editingImage, newUrl: newImageUrl }),
            });

            if (response.ok) {
                setOpenSnackbar(true);
                const updatedGallery = await response.json();
                setGallery(updatedGallery.data.gallery || []);
                setEditingImage(null);
            } else {
                console.error("Failed to update image");
            }
        } catch (error) {
            console.error("Error updating image:", error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        navigate(`/trip/${tripId}`);
    };

    return (
        <div className="container">
            <h1>Add Image to Gallery</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Image URL"
                    variant="outlined"
                    fullWidth
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Add Image
                </Button>
            </form>

            <div className="gallery">
                <h2>Existing Gallery</h2>
                {gallery.map((image, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <img
                            src={image.url}
                            alt={image.place}
                            width={100}
                            height={100}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleEditImage(image.url)}
                        />
                        <div>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ mt: 1, mr: 1 }}
                                onClick={() => handleDeleteImage(image.url)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {editingImage && (
                <form onSubmit={handleUpdateImage}>
                    <TextField
                        label="New Image URL"
                        variant="outlined"
                        fullWidth
                        required
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2 }}>
                        Update Image
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setEditingImage(null)}
                        sx={{ mt: 2, ml: 2 }}
                    >
                        Cancel
                    </Button>
                </form>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    Changes Saved!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddGallery;
