import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          ></IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart Photo Booth
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
