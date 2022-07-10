import React, { Component } from "react";
import Axios from "axios";
import AutoCompleteItem from "./autoCompleteItem";
import TopSearchBar from "./topSearchBar";
import logo from "../../src/logo.png";


export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      searchResults: null,
      loadAutoCompleteList: false,
      autoCompleteResults: null,
      loadTopSearchBar: false,
      loading: false
    };
  }

  onChangeInput = (event) => {
    this.setState({
      searchInput: event.target.value,
      loadAutoCompleteList: true,
      // loading: true 
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
        // loading: false 
      });
    });
  };

  onSearch = () => {
    if(this.state.searchInput === ''){
      alert("Please enter something to search")
    }else{
      this.setState({
        loadTopSearchBar: true,
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
        url: urlForSearch, 
      }).then((res) => {
        // console.log(res.data["result"]);
        this.setState({ 
          searchResults: res.data["result"], 
          loading: false,
          loadAutoCompleteList: false,
        });
      });
    }
  };

  // updateSearchResults = (newSearchResults) => {
  //   this.setState({searchResults: newSearchResults});
  // }

  onLoadSuggestion = (suggestion) => {
    this.setState({ searchInput: suggestion, loadAutoCompleteList: false });
  };

  render() {
    const isTopSearchBarLoaded = this.state.loadTopSearchBar;
    if (isTopSearchBarLoaded && this.state.searchResults) {
      return (
        <div>
          <TopSearchBar
            searchInput={this.state.searchInput}
            autoCompleteList={this.props.autoCompleteList}
            searchResults={this.state.searchResults}
            // updateSearchResults={this.updateSearchResults}
          />

        </div>
      );
    } else {
      return (
        <div>
          <div>
            <img className="logo-image" src={logo} alt="logo" />
          </div>
          <div className="search-bar-container">
            <div className="search-bar-suggestion-container">
              <div className="input-group">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Enter Search Query here!!"
                  value={this.state.searchInput}
                  onChange={this.onChangeInput}
                />
                <div className="input-group-append">
                  <button
                  type="button"
                    className="btn btn-outline-secondary"
                    onClick={this.onSearch}
                  >
                    Search
                  </button>
                </div>
                {/* <DataOutput/>	 */}
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
          </div>
        </div>
      );
    }
  }
}