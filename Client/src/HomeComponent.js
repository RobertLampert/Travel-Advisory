import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
    Card,
    CardHeader,
    CardContent,
    Typography
    } from "@mui/material";
import theme from "./theme";
import "../App.css";
import logo from "./logo.jpeg";

const HomeComponent = () => {
    return (
        <ThemeProvider theme={theme}>
        <Card>
        <CardHeader
          title="Travel Alerts"
          color="inherit"
          style={{ textAlign: "center", paddingTop: "10vh" }}
        />
        <CardContent style={{ textAlign: "center" }}>
          <img src={logo} alt="globe" />
          <br />
          <Typography
            color="primary"
            style={{ float: "right", paddingRight: "1vh", fontSize: "smaller" }}
          >
            &copy;Travel Advisory App - 2023
          </Typography>
        </CardContent>
      </Card>
      </ThemeProvider>
    );
};

export default HomeComponent;