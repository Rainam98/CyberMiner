import React, { Component } from 'react';
import Axios from 'axios';
import AutoCompleteItem from './autoCompleteItem'

export default class  SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state ={
      searchInput: '',
      loadAutoCompleteList: false,
    };
  }

  onChangeInput = (event) => {
    this.setState({
      searchInput: event.target.value,
      loadAutoCompleteList: true,
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

  onLoadSuggestion = suggestion => {
    this.setState({searchInput: suggestion})
  }

  render() {
    const filteredList = this.props.autoCompleteList.filter(option =>
      option.suggestion.toUpperCase().includes(this.state.searchInput.toUpperCase()),
    )

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

          {this.state.loadAutoCompleteList && <ul className="auto-complete-list">
            {filteredList.map(each => (
              <AutoCompleteItem
                key={each.id}
                suggestion={each.suggestion}
                onLoadSuggestion={this.onLoadSuggestion}
              />
            ))}
          </ul>}
        </div>
      </div>
    )
  }
}