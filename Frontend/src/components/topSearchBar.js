import logo from "../logo_small.png";
import React, { Component } from "react";
import "./topSearchBar.css";

export default class TopSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: props.searchInput,
      loadAutoCompleteList: false,
    };
  }

  onChangeInput = (event) => {
    this.setState({
      searchInput: event.target.value,
      loadAutoCompleteList: true,
    });
  };

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
      <div id="toolbar" className="toolbar ui-widget-content">
        <img className="logo-image-small" src={logo} alt="logo" />
        <div className="horizontal">
          <input
            type="text"
            id="inputToolbar"
            value={this.state.searchInput}
            onChange={this.onChangeInput}
          />
          <button id="readInputToolbar">Search</button>
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
    );
  }
}
