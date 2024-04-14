import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import SearchPanel from "./components/SearchPanel";
import { Container, Grid } from "@mui/material";
import axios from "axios";
import Images from "./components/Images";
import UploadImage from "./components/UploadImage";
import Navbar from "./components/Navbar";

type SearchResponse = {
  url: string;
  labels: string[];
};

function App() {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<String[]>([]);

  const searchContent = (searchContent: string) => {
    setContent(searchContent);
  };

  useEffect(() => {
    axios
      .get(
        "https://oy9siziwkf.execute-api.us-east-1.amazonaws.com/test1/search?q=" +
          content
      )
      .then((response) => {
        console.log("Searching: " + content);
        console.log(response.data.body);
        const urls = JSON.parse(response.data.body).map(
          (item: any) => item.url
        );
        console.log(urls);
        setImages(urls);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response:", error.response.data);
          console.error("Status:", error.response.status);
          console.error("Headers:", error.response.headers);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
        console.error("Error config:", error.config);
      });
  }, [content]);

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Grid
          container
          spacing={2}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid
            item
            xs={10}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <SearchPanel searchContent={searchContent} />
          </Grid>
          <Grid
            item
            xs={12}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <UploadImage />
          </Grid>
          <Grid
            item
            xs={12}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Images images={images} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
