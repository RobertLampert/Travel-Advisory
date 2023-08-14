import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material";
import theme from "./theme";
import "../App.css";
import logo from "./logo.jpeg";

const AlertComponent = props => {
    const initialState = {
      alerts: [],
      snackbarMsg: "",
      contactServer: false
    };
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);
    useEffect(() => {
      fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
      let bodyStr = JSON.stringify({ query: "{setupalerts}" });
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      try {
        props.snackbarDisplay("Running setup..",true);
        let response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: myHeaders,
          body: bodyStr
        });
        let json = await response.json();
  
        let resArr = [];
        resArr = json.data.setupalerts
          .replace(/([.])\s*(?=[A-Z])/g, "$1|")
          .split("|");
        setState({
          alerts: resArr,
        });
        props.snackbarDisplay("Completed setup.",true);
      } catch (error) {
        console.log(error);
        props.snackbarDisplay("Problem loading server data.",true);
      }
    };
  
    let rowIndex = 1;
    return (
      <ThemeProvider theme={theme}>
        <Card>
          <CardHeader
            title="Alert Setup - Details"
            style={{ textAlign: "center" }}
          />
          <CardContent style={{ textAlign: "center" }}>
            <img src={logo} alt="globe" />
            <p />
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableBody>
                  {state.alerts.map(row => (
                    <TableRow key={rowIndex++}>
                      <TableCell>{row}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </ThemeProvider>
    );
  };

export default AlertComponent;