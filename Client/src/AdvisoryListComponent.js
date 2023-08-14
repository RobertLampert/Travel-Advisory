import React, {useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Autocomplete,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper
} from "@mui/material";
import theme from "./theme";
import "../App.css";
import logo from "./logo.jpeg";


const AdvisoryListComponent = props => {
    const initialState = {
        alerts: [],
        advisories: [],
        subregions: [],
        regions: [],
        dataList: [],
        dataQuery: [],
        displayedItems: [],
        radioSwitch: false,
        textFieldValue: "",
        typeSelected: "" 
    };

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            props.snackbarDisplay(`Attempting to load ${state.typeSelected} data from server...`,true);
            let response = await fetch("http://localhost:5000/graphql",{
              method: "POST",
              headers: myHeaders,
              body: JSON.stringify({query: 
                "{advisories{name text date traveller}, regions, subregions, alerts{country name text date region subregion}}"
              })
            });
            let json = await response.json();

            setState({
              alerts: json.data.alerts,
              advisories: json.data.advisories,
              subregions: json.data.subregions,
              regions: json.data.regions,
              travellers: [...new Set(json.data.advisories.map(a => a.traveller))],
              dataList: [],
            });
        }catch(error){
            props.snackbarDisplay(`Problem loading server data - ${error.message}`);
        }
    };

    const dataMsg = async () => {
      props.snackbarDisplay(`Found ${state.dataList.length} ${state.typeSelected}.`);
    };

    const defineData = async () => {
        try{
          if(state.typeSelected==="Travellers"){
            state.dataList = state.travellers;
          }else if(state.typeSelected==="Regions"){
            state.dataList = state.regions;
          }else{
            state.dataList = state.subregions;
          }
        }catch(error){
          props.snackbarDisplay(`Problem loading server data - ${error.message}`);
        }
    };

    const loadDataQuery = async (selectedOption) => {
      if(selectedOption==="" || selectedOption===null){
        return;
      }else if(state.typeSelected==="Travellers"){
        state.dataQuery = [];
        state.dataQuery = state.advisories.filter(element=>element.traveller===selectedOption);
        state.displayedItems = state.dataQuery;
        props.snackbarDisplay(`Found ${state.displayedItems.length} alerts for ${selectedOption}`);
      }else if(state.typeSelected==="Regions"){
        state.dataQuery = [];
        state.dataQuery = state.alerts.filter(element=>element.region===selectedOption);
        state.displayedItems = state.dataQuery;
        props.snackbarDisplay(`Found ${state.displayedItems.length} alerts for ${selectedOption}`);
      }else{
        state.dataQuery = [];
        state.dataQuery = state.alerts.filter(element=>element.subregion===selectedOption);
        state.displayedItems = state.dataQuery;
        props.snackbarDisplay(`Found ${state.displayedItems.length} alerts for ${selectedOption}`);
      }
    };

    const [autoValue, setAutoValue] = React.useState('');
    const [value, setValue] = React.useState('');

    const handleRadioChange = (event) => {
        setValue(event.target.value);
        // setState({textFieldValue:})
        state.textFieldValue = "";
    };

    const autocompleteChange = (e,newAutoValue)=>{
      console.log(state.radioSwitch);
      if (state.radioSwitch===true){
        console.log(`route 1`);
        setAutoValue("");
        state.radioSwitch = false;
        return;
      }else{
        console.log(`route 2`);
        setAutoValue(newAutoValue);
        loadDataQuery(newAutoValue);
      }
    };

    let rowIndex = 1;

    return (
        <ThemeProvider theme={theme}>
          <Card>
            <CardHeader title="World Wide Travel Alerts" style={{ textAlign: "center" }} />
            <img src={logo} alt="globe"/>
            <CardHeader title="List Advisories By:" style={{ textAlign: "center" }} />
            <CardContent>
            <FormControl>
            <FormLabel component="legend"></FormLabel>
                <RadioGroup
                    row
                    aria-label="radio-buttons-group-label"
                    defaultValue = "Travellers"
                    value={state.typeSelected}
                    name="row-radio-buttons-group"
                    onChange = {handleRadioChange}
                >
                    <FormControlLabel 
                        value="Travellers" 
                        control={<Radio />} 
                        label="Traveller" 
                        labelPlacement = "top"
                        onClick={()=>{
                            state.displayedItems = [];
                            state.typeSelected = "Travellers";
                            defineData();
                            dataMsg();
                            state.radioSwitch = true;
                        }}
                    />
                    <FormControlLabel 
                        value="Regions" 
                        control={<Radio />} 
                        label="Region" 
                        labelPlacement = "top"
                        onClick={()=>{
                            state.displayedItems = [];
                            state.typeSelected = "Regions";
                            defineData();
                            dataMsg();
                            state.radioSwitch = true;
                        }}
                    />
                    <FormControlLabel 
                        value="Sub-regions" 
                        control={<Radio />} 
                        label="Sub-Region" 
                        labelPlacement = "top"
                        onClick={()=>{
                            state.displayedItems = [];
                            state.typeSelected = "Sub-regions";
                            defineData();
                            dataMsg();
                            state.radioSwitch = true;
                        }}
                    />
                </RadioGroup>
            </FormControl>
              <br />
              <Autocomplete
              id="autocompleteDataQuery"
              options={state.dataList}
              getOptionLabel={option => option}
              style={{ width: 300 }}
              // onChange={onTest}
              inputValue = {autoValue}
              onInputChange={autocompleteChange}//fires on changing radio button
              renderInput={params => (
                <TextField
                  {...params}
                  label={state.typeSelected}
                  variant="outlined"
                  value={state.textFieldValue}
                  fullWidth
                />
              )}
              />
              <p />
              <TableContainer component={Paper}>
              <Table size="small" aria-label="a table">
                <TableHead>
                  <TableRow>
                    <TableCell>Country</TableCell>
                    <TableCell>Alert Information</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.displayedItems.map(row => (
                    <TableRow key={rowIndex++}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell><div>{row.text}</div>{row.date}</TableCell>
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

export default AdvisoryListComponent;