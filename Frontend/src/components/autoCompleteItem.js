import React, { Component } from "react";

export default class AutoCompleteItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // searchInput: '',
    };
  }

  onClickFullSuggestion = () => {
    this.props.onLoadSuggestion(this.props.suggestion);
  };

  render() {
    return (
      /*<li className="suggestion-item" > */
      <li 
        className="suggestion-name"
        style={{ textAlign: "left" }}
        onClick={this.onClickFullSuggestion}
      >
        {this.props.suggestion}
      </li>
      /*{ <img
        className="arrow-image"
        src="https://assets.ccbp.in/frontend/react-js/diagonal-arrow-left-up.png"
        alt="arrow"
        
      /> }*/
      /*</li>*/
    );
  }
}
