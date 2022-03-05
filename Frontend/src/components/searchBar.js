import React, { Component } from "react";	
import Axios from "axios";	
import AutoCompleteItem from "./autoCompleteItem";	
import TopSearchBar from "./topSearchBar";	
import logo from "../../src/logo.png";	
import DataOutput from "./dataOutput";
	
export default class SearchBar extends Component {	
  constructor(props) {	
    super(props);	
    this.state = {	
      searchInput: "",	
      loadAutoCompleteList: false,	
      loadTopSearchBar: false,	
      urls: [],	
      loading: false	
    };	
  }	
  onChangeInput = (event) => {	
    this.setState({	
      searchInput: event.target.value,	
      loadAutoCompleteList: true,	
    });	
  };	
  onSearch = () => {	
    this.setState({	
      loadTopSearchBar: true,	
      loading:true	
    });	
    Axios({	
      method: "POST",	
      data: {	
        searchInput: this.state.searchInput,	
      },	
      url: "http://localhost:5000", // Port 5000 is the default port for Python Flask app	
    }).then((res) => {	
      console.log(res);	
      this.setState({urls:res.data.items,loading:false})	
    });	
  };	
  onLoadSuggestion = (suggestion) => {	
    this.setState({ searchInput: suggestion });	
  };	
  render() {	
    const filteredList = this.props.autoCompleteList.filter((option) =>	
      option.suggestion	
        .toUpperCase()	
        .includes(this.state.searchInput.toUpperCase())	
    );	
    const isTopSearchBarLoaded = this.state.loadTopSearchBar;	
    if (isTopSearchBarLoaded) {	
      return (	
        <div><TopSearchBar	
        searchInput={this.state.searchInput}	
        autoCompleteList={this.props.autoCompleteList}	
            />	
            <DataOutput />	
        </div>	
        	
        	
     );	
    } else {	
      return (	
        <>	
          <div>	
            <img className="logo-image" src={logo} alt="logo" />	
          </div>	
          <div className="search-bar-container">	
            <div className="search-bar-suggestion-container">	
              <div className="input-container">	
                <input	
                  className="search-input"	
                  type="search"	
                  placeholder="Search"	
                  value={this.state.searchInput}	
                  onChange={this.onChangeInput}	
                />	
                <button	
                  className="search-btn btn btn-outline-secondary"	
                  onClick={this.onSearch}	
                >	
                  Search	
                </button>	
                <dataOutput/>	
              </div>	
              {this.state.loadAutoCompleteList && (	
                <ul className="auto-complete-list">	
                  {filteredList.map((each) => (	
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
        </>	
      );	
    }	
  }	
}