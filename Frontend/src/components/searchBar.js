import React, { Component } from 'react';
import Axios from 'axios';
// import SuggestionItem from '../SuggestionItem'
// import './index.css'

export default class  SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state ={
      searchInput: '',
    };
  }

  onChangeInput = (event) => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onSearch = () => {
    Axios({
      method: 'POST',
      data: {
        searchInput: this.state.searchInput
      },
      url: 'http://localhost:5000', // Port 5000 is the default port for Python Flask app
    }).then((res) => {
      console.log(res);
    });
  }

//   onFullSuggestion = suggestion => {
//     this.setState({searchInput: suggestion})
//   }

  render() {
    // const filteredList = suggestionsList.filter(each =>
    //   each.suggestion.toUpperCase().includes(searchInput.toUpperCase()),
    // )

    return (
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
            <button className="search-btn btn btn-outline-secondary" onClick={this.onSearch}>Search</button>
          </div>


          {/* <ul className="suggestions-list">
            {filteredList.map(each => (
              <SuggestionItem
                key={each.id}
                suggestion={each.suggestion}
                onFullSuggestion={this.onFullSuggestion}
              />
            ))}
          </ul> */}
        </div>
      </div>
    )
  }
}
