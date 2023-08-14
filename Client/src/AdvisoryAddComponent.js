import React, {useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Autocomplete
} from "@mui/material";
import theme from "./theme";
import "../App.css";
import logo from "./logo.jpeg";

const AdvisoryAddComponent = props => {
    const initialState = {
      msg: "",
      country: "",
      traveller: "",
      date: new Date(),
      countries: []
    };

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const onChange = (e, selectedOption) => {
      selectedOption
        ? setState(
            {country: selectedOption}
          )
        : setState("");
    };

    const handleNameInput = e => {
      setState({ traveller: e.target.value });
    };

    const emptyorundefined =
    state.traveller === undefined ||
    state.traveller === "" ||
    state.country === undefined ||
    state.country === "" ;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    useEffect(() => {
      fetchCountries();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCountries = async () => {
      try {
        props.snackbarDisplay("Attempting to load country data from server...",true);
        let response = await fetch("http://localhost:5000/graphql",{
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({query: "{countries}"})
        });
        let json = await response.json();
        props.snackbarDisplay(`found ${json.data.countries.length} countries`,true);
        setState({
          countries: json.data.countries
        });
      } catch (error) {
        props.snackbarDisplay(`Problem loading server data - ${error.message}`);
      }
    };

    const onAddClicked = async () => {
      props.snackbarDisplay(`Advisory added on ${state.date}`,true);
        let response = await fetch("http://localhost:5000/graphql",{
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({query: "{alerts{name,text}}"})
        });

        let advisoryStr = await response.json();
        let alertData = advisoryStr.data.alerts;

        const findAdvisory = (country) => {
          let countryObj = alertData.filter(nation=>nation.name===country);
          return countryObj[0].text;
        };
        
        try{
          let response = await fetch("http://localhost:5000/graphql",{
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
              query: `mutation{
                addadvisory(
                  name: "${state.country}", text: "${findAdvisory(state.country)}", date: "${state.date}", traveller: "${state.traveller}"){name,text,date,traveller
                }}`
            })
          });
          await response.json();
        }catch(error){
          console.log(error);
          props.snackbarDisplay(`Problem loading server data - ${error.message}`,true);
        }
    };

    return (
      <ThemeProvider theme={theme}>
        <Card>
          <CardHeader title="World Wide Travel Alerts" style={{ textAlign: "center" }} />
          <img src={logo} alt="globe"/>
          <CardHeader title="Add Advisory" style={{ textAlign: "center" }} />
          <CardContent>
          <form noValidate autoComplete="off">
            <TextField
                id="standard-basic"
                onChange={handleNameInput}
                helperText="Enter traveller's name here"
                value={state.traveller}
            />
            </form>
            <br />
            <Autocomplete
              id="countryToAdd"
              options={state.countries}
              getOptionLabel={option => option}
              style={{ width: 300 }}
              onChange={onChange}
              renderInput={params => (
                <TextField
                  {...params}
                  label="countries"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <br/>
            <Button
            color="secondary"
            variant="contained"
            onClick={onAddClicked}
            disabled={emptyorundefined}
            >
            Add Advisory
          </Button>
            <p />
          </CardContent>
        </Card>
      </ThemeProvider>
    );
  };

export default AdvisoryAddComponent;