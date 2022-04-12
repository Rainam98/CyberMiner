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
    if(this.state.searchInput == ''){
      alert("Please enter something to search")
    }else{
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
    }
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
