import React, { Component } from "react";
import Axios from "axios";
import "./UrlDataTable.css"

export default class UrlDataTable extends Component {
    constructor(props) {
        super(props);
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
            url: "http://localhost:5000/searchWord",
        }).then((res) => {
            this.setState({
                data: res.data["result"]
            })
        });
    }
    
     render() {
        return (
            <div>
                <div className="shiftLeft">
                    <a href="/"><button className="btn btn-primary">Back to Search</button></a>
                </div>
                <div className="datatable">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Description</th>
                                <th scope="col">URL</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data && this.state.data.map((details) => (
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