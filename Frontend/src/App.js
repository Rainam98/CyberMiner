import "./App.css";
import SearchBar from "./components/searchBar";
import React from "react";
import UrlDataTable from "./components/UrlDataTable";
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router >
      <Route exact path='/' render={props => (
        <div className="App">
          <div className="shiftRight">
            <a href="/urls"><button className="btn btn-primary">View URLs</button></a>
          </div>
          <React.Fragment >
            <SearchBar />
          </React.Fragment>
        </div>
      )} />

      <Route path='/urls' component={UrlDataTable} />
    </Router>

  );
}

export default App;
