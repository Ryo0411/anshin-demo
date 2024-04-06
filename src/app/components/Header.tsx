import React from "react";
import { AppBar, IconButton, Link, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#0c6587" }}>
      <Toolbar
        variant="dense"
        sx={{ justifyContent: "center", display: "flex" }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ position: "absolute", left: 15 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="inherit">
          <Link
            href="/"
            underline="none"
            color="inherit"
            sx={{ verticalAlign: -3 }}
          >
            話者識別デモ
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
