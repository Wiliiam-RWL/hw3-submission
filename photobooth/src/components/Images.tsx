import { ImageList, ImageListItem } from "@mui/material";
import React from "react";

interface Props {
  images: String[];
}

export default function Images({ images }: Props) {
  return (
    <>
      <ImageList
        sx={{ width: 500, height: 450 }}
        variant="woven"
        cols={3}
        gap={8}
      >
        {images.map((item) => (
          <ImageListItem key={item.toString()}>
            <img src={`${item}`} alt={"No Image"} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
