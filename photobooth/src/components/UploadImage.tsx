import { Button, Grid, TextField } from "@mui/material";
import { tab } from "@testing-library/user-event/dist/tab";
import axios from "axios";
import React, { useRef, useState } from "react";

export default function UploadImage() {
  const [tags, setTags] = useState("");

  const [selectedFile, setSelectedFile] = useState<File>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const uploadImage = (file: File | undefined) => {
    if (!file) {
      console.error("No file selected!");
      return;
    }
    const objectKey = file.name;
    const url = `https://oy9siziwkf.execute-api.us-east-1.amazonaws.com/test1/photos/image-bucket-hw2-894311263883/${objectKey}`;

    const headers = {
      "Content-Type": file.type, // Use the file's MIME type
      "x-amz-meta-customLabels": tags, // Custom metadata header
    };

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.readyState === FileReader.DONE) {
        axios
          .put(url, reader.result, { headers })
          .then((response) => {
            console.log("Upload successful!", response);
            alert("Upload successful!");
          })
          .catch((error) => {
            console.error("Upload failed", error);
            alert("Upload failed");
          });
      }
    };

    // Read the file as an ArrayBuffer to handle it as a binary stream
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Grid container padding={2}>
        <Grid
          item
          xs={4}
          justifyContent={"right"}
          alignContent={"center"}
          display={"flex"}
        >
          <input
            accept="image/*"
            type="file"
            onChange={handleFileChange}
            id="image-upload"
            style={{ display: "none" }}
          />
          <TextField
            fullWidth
            id="standard-basic"
            label="tags"
            variant="standard"
            onChange={(event) => {
              setTags(event.target.value);
            }}
          />
        </Grid>
        <Grid
          item
          xs={4}
          justifyContent={"center"}
          alignContent={"center"}
          display={"flex"}
        >
          <label htmlFor="image-upload">
            <Button variant="text" component="span">
              Choose Image
            </Button>
          </label>
        </Grid>
        <Grid
          item
          xs={4}
          justifyContent={"left"}
          alignContent={"center"}
          display={"flex"}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => uploadImage(selectedFile)}
            disabled={!selectedFile}
            fullWidth
          >
            Upload Image
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
