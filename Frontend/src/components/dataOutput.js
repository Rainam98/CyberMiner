import React, { Component } from 'react'

export default class DataOutput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: props.searchResults,
    };
  }

  render() {
    const resultList = [];
    // console.log(this.state.searchResults);

    if (this.state.searchResults){
      this.state.searchResults.forEach((data) => {
        resultList.push(
        <div key={data.title} className="card result-card">
          <div className="card-body">
            <a href={data.url} target="_blank">{data.url}</a>
            <h1 className='data-title'>{data.title}</h1>
            <p>{data.description}</p>
          </div>
        </div>
        )
      })
      return (
      <div>
          {resultList}
      </div>
      )
    } 
  }
}
