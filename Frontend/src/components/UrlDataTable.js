import React, { useEffect, useState } from "react";
import Axios from "axios";

import "./UrlDataTable.css"

export default class UrlDataTable extends React.Component {

    Constructor(prop) {
        this.state = {
            data: null
        }
    }

    async componentDidMount() {

        await Axios({
            method: "POST",
            data: {
                searchInput: "",
            },
            url: "http://localhost:5000/searchWord", // Port 5000 is the default port for Python Flask app	
        }).then((res) => {
            // console.log(res.data["result"]);
            this.setState({
                data: res.data["result"]
            })
            console.log(this.state.data)
            
        });
    }
    
     render() {
        return (
            <div>
                <div className="shiftLeft">
                    <a href="/"><button className="btn btn-primary">Back to Search</button></a>
                </div>
                <div className="datatable">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Description</th>
                                <th scope="col">URL</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((details) => (
                                <tr>
                                <td>{details.title}</td>
                                <td>{details.description}</td>
                                <td>{details.url}</td>
                                <td>
                                    <div className="btn-grp">
                                        <button className="btn btn-warning">Edit</button>
                                        <button className="btn btn-danger">Delete</button>
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );

    }


}