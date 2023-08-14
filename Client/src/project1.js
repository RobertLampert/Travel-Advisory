import React, { useState, useReducer } from "react";
import { ThemeProvider } from '@mui/material/styles';
import {
  Toolbar,
  AppBar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Snackbar
} from "@mui/material";
import "../App.css";
import theme from "./theme";
import Reorder from "@mui/icons-material/Reorder";
import { Route, Routes, Link, redirect as Redirect } from "react-router-dom";
import AlertComponent from "./AlertComponent";
import HomeComponent from "./HomeComponent";
import AdvisoryAddComponent from "./AdvisoryAddComponent";
import AdvisoryListComponent from "./AdvisoryListComponent";

const Project1Component = () => {

const initialState = {
  msg: "",
  country: "",
  traveller: "",
  date: new Date(),
  countries: []
};

const [anchorEl, setAnchorEl] = useState(null);

const onMenuButtonClicked = event => {
  setAnchorEl(event.currentTarget );
};

const onClose = () => {
  setAnchorEl(null);
};

const reducer = (state, newState) => ({ ...state, ...newState });
const [state, setState] = useReducer(reducer, initialState);

const snackbarDisplay = (e, contactServer) => {
  setState({ snackBarMsg: e, contactServer: true });
};

const snackbarClose = () => {
  setState({
    contactServer: false,
  });
};

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" color="inherit">
                Travel Advisory App
            </Typography>
          <IconButton onClick={onMenuButtonClicked} color="inherit">
            <Reorder />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
          >
            <MenuItem component = {Link} to="/home" onClick={onClose}>Home</MenuItem>
            <MenuItem component = {Link} to="/alerts" onClick={onClose}>Reset Alerts</MenuItem>
            <MenuItem component = {Link} to="/addadvisory" onClick={onClose}>Add Advisory</MenuItem>
            <MenuItem component = {Link} to="/listadvisories" onClick={onClose}>List Advisories</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <div>
        <Routes>
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route path="/home" element={<HomeComponent snackbarDisplay={snackbarDisplay}/>} />
            <Route path="/alerts" element={<AlertComponent snackbarDisplay={snackbarDisplay}/>} />
            <Route path="/addadvisory" element={<AdvisoryAddComponent snackbarDisplay={snackbarDisplay}/>} />
            <Route path="/listadvisories" element={<AdvisoryListComponent snackbarDisplay={snackbarDisplay} />} /> 
        </Routes>
     </div>
     <Snackbar
        open={state.contactServer}
        message={state.snackBarMsg}
        autoHideDuration={4000}
        onClose={snackbarClose}
      />
    </ThemeProvider>
  );
};

export default Project1Component;
