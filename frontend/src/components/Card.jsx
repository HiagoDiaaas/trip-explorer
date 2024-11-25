import React from "react";
import {
  Card,
  Typography,
  CardMedia,
  CardActionArea
} from "@mui/material";
import defaultImage from "../images/default.png";

const CardItem = ({ country, galleryImages }) => {
  const imageUrl = galleryImages && galleryImages.length > 0 ? galleryImages[0] : defaultImage;

  return (
    <Card sx={{ width: 470 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="300"
          image={imageUrl}
          alt={country}
        />
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ margin: "5px 0 0 10px" }}
        >
          {country}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default CardItem;
