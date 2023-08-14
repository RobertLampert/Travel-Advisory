import React from "react";
import { render } from "react-dom";

// import Project1Component from "./project 1/project1";
import { BrowserRouter as Router } from "react-router-dom";
import Project1Component from "./src/project1";

render(
    <Router>
        <Project1Component />
    </Router>,
    document.querySelector("#root")
);