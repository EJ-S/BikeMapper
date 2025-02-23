import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Map App";
      case "/route-planner":
        return "Route Planner";
      case "/saved-routes":
        return "Saved Routes";
      case "/all-routes":
        return "All Routes";
      default:
        return "Map App";
    }
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
            <MenuItem onClick={() => { navigate("/"); handleMenuClose(); }}>
              Home
            </MenuItem>
            <MenuItem onClick={() => { navigate("/route-planner"); handleMenuClose(); }}>
              Route Planner
            </MenuItem>
            <MenuItem onClick={() => { navigate("/saved-routes"); handleMenuClose(); }}>
              Saved Routes
            </MenuItem>
            <MenuItem onClick={() => { navigate("/all-routes"); handleMenuClose(); }}>
              All Routes
            </MenuItem>
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {getTitle()}
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
