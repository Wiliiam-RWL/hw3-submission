import { Button, Container, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

interface Props {
  searchContent: (content: string) => void;
}

export default function SearchPanel({ searchContent }: Props) {
  const [content, setContent] = useState("");

  return (
    <>
      <Grid container padding={2}>
        <Grid item sm={8} justifyContent="right" display="flex" padding={2}>
          <TextField
            id="search_content"
            fullWidth
            label="Search categories"
            variant="outlined"
            onChange={(event) => {
              setContent(event.target.value);
            }}
          />
        </Grid>
        <Grid item sm={4} justifyContent="right" display="flex" padding={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              searchContent(content);
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
