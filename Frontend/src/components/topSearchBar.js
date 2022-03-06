import logo from "../logo_small.png";
import React, { Component } from "react";
import "./topSearchBar.css";
import Axios from "axios";
import DataOutput from "./dataOutput";

export default class TopSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: props.searchInput,
      searchResults: props.searchResults,
      loadAutoCompleteList: false,
      loading: false
    };
  }

  onChangeInput = (event) => {
    this.setState({
      searchInput: event.target.value
    });
  };

  onSearch = () => {
    this.setState({
      loading: true
    });
    Axios({
      method: "POST",
      data: {
        searchInput: this.state.searchInput,
      },
      url: "http://localhost:5000/searchWord", // Port 5000 is the default port for Python Flask app	
    }).then((res) => {
      // this.updateSearchResults(res.data["result"]) 
      this.setState({ 
        searchResults: res.data["result"], 
        loading: false 
      });
    });
  };

//   updateSearchResults=(newResults)=> {
//     this.props.updateSearchResults(newResults);
// }


  onLoadSuggestion = (suggestion) => {
    this.setState({ searchInput: suggestion });
  };

  render() {
    // console.log(this.props.autoCompleteList);
    // const filteredList = this.props.autoCompleteList.filter((option) =>
    //   option.suggestion
    //     .toUpperCase()
    //     .includes(this.state.searchInput.toUpperCase())
    // );

    return (
      <div>
        <div id="toolbar" className="toolbar ui-widget-content">
          <img className="logo-image-small" src={logo} alt="logo" />
          <div className="horizontal">
            <input
              type="text"
              id="inputToolbar"
              value={this.state.searchInput}
              onChange={this.onChangeInput}
            />
            <button id="readInputToolbar" onClick={this.onSearch}>Search</button>
          </div>
          
          {/* {this.state.loadAutoCompleteList && (
            <ul className="auto-complete-list">
              {filteredList.map((each) => (
                <AutoCompleteItem
                  key={each.id}
                  suggestion={each.suggestion}
                  onLoadSuggestion={this.onLoadSuggestion}
                />
              ))}
            </ul>
          )} */}
        </div>
        <br/><br/>
        {!this.state.loading && this.state.searchResults && this.state.searchResults.length!==0 && <DataOutput searchResults={this.state.searchResults} />}
        {this.state.searchResults && this.state.searchResults.length===0 && <h1 id="no-result-title">No result found.</h1>}      
      </div>
    );
  }
}
