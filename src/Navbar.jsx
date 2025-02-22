import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Dynamically set the Navbar title based on the current page
  const getTitle = () => {
    if (location.pathname === "/") return "Map App";
    if (location.pathname === "/route-planner") return "Route Planner";
    return "Map App"; // Default title if needed
  };

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
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                navigate("/");
                handleMenuClose();
              }}
            >
              Home
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/route-planner");
                handleMenuClose();
              }}
            >
              Route Planner
            </MenuItem>
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {getTitle()} {/* Dynamically updates based on the route */}
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
