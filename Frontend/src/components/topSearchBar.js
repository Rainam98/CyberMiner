import logo from "../logo_small.png";
import React, { Component } from "react";
import "./topSearchBar.css";
import Axios from "axios";
import DataOutput from "./dataOutput";
import AutoCompleteItem from "./autoCompleteItem";

export default class TopSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: props.searchInput,
      searchResults: props.searchResults,
      loadAutoCompleteList: false,
      autoCompleteResults: null,
      loading: false
    };
  }

  onChangeInput = (event) => {
    this.setState({
      searchInput: event.target.value,
      //loadAutoCompleteList: true,
      //loading: true 
    });
    Axios({
      method: "POST",
      data: {
        autoCompleteKey: event.target.value,
      },
      url: "http://localhost:5000/autoComplete"
    }).then((res) => {
      let autoCompleteList = [];
      for (var i=1; i<=res.data["autoCompleteList"].length; i++){
        autoCompleteList.push({ id: i, suggestion: res.data["autoCompleteList"][i-1] })
      }
      this.setState({ 
        autoCompleteResults: autoCompleteList, 
        // loadAutoCompleteList: false,
        loading: false 
      });
    });
  };

  onSearch = () => {
    if(this.state.searchInput === ''){
      alert("Please enter something to search")
    }else{
      this.setState({
        loading: true
      });

      let inputKey = this.state.searchInput.split(" ");
      let urlForSearch = "http://localhost:5000/searchWord"; // Port 5000 is the default port for Python Flask app	
      if (inputKey.includes("AND") || inputKey.includes("OR") || inputKey.includes("NOT")){
        urlForSearch = "http://localhost:5000/binarySearch"
      }

      Axios({
        method: "POST",
        data: {
          searchInput: this.state.searchInput,
        },
        url:urlForSearch
      }).then((res) => {
        // this.updateSearchResults(res.data["result"]) 
        this.setState({ 
          searchResults: res.data["result"], 
          loading: false ,
          loadAutoCompleteList: false,
        });
      });
    }
  };

//   updateSearchResults=(newResults)=> {
//     this.props.updateSearchResults(newResults);
// }


  onLoadSuggestion = (suggestion) => {
    this.setState({ searchInput: suggestion });
  };

  render() {
    return (
      <div>
        <div id="toolbar" className="toolbar ui-widget-content">
          <img className="logo-image-small" src={logo} alt="logo" />
          
          <div className="search-bar-container">
            <div className="search-bar-suggestion-container">
            <div className="input-group">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Enter Search Query here!!"
                  value={this.state.searchInput}
                  onChange={this.onChangeInput}
                  id="inputToolbar"
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={this.onSearch}
                    id="readInputToolbar"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {this.state.loadAutoCompleteList && this.state.autoCompleteResults && (	
                <ul className="auto-complete-list">	
                  {this.state.autoCompleteResults.map((each) => (	
                    <AutoCompleteItem	
                      key={each.id}	
                      suggestion={each.suggestion}	
                      onLoadSuggestion={this.onLoadSuggestion}	
                    />	
                  ))}	
                </ul>	
                  )}
        </div>
        <br/><br/>
        {!this.state.loading && this.state.searchResults && this.state.searchResults.length!==0 && <DataOutput searchResults={this.state.searchResults} />}
        {this.state.searchResults && this.state.searchResults.length===0 && <h1 id="no-result-title">No result found.</h1>}      
      </div>
    );
  }
}
