import React, { Component } from "react";
import Axios from "axios";
import "./UrlDataTable.css"
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';

export default class UrlDataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,

            title:"",
            url:"",
            description:"",
        }
    }

    componentDidMount() {
        this.loadAllRecords()
    }

    loadAllRecords = ()=>{
        Axios({
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

    addRecord = () => {
        Axios({
            method: "POST",
            data: {
                newRecord: {
                    title: this.state.title,
                    url: this.state.url,
                    description: this.state.description,
                }
            },
            url: "http://localhost:5000/createRecord",
        }).then((res) => {
            console.log(res.data["result"]);
            this.loadAllRecords();
        });
    }

    updateRecord = () => {
        Axios({
            method: "POST",
            data: {
                existingRecord: {
                    title: this.state.title,
                    description: this.state.description,
                }
            },
            url: "http://localhost:5000/updateRecord",
        }).then((res) => {
            console.log(res.data["result"]);
            this.loadAllRecords();
        });
    }

    deleteRecord = () => {
        Axios({
            method: "POST",
            data: {
                existingRecord: {
                    title: this.state.title,
                }
            },
            url: "http://localhost:5000/deleteRecord",
        }).then((res) => {
            console.log(res.data["result"]);
            this.loadAllRecords();
        });
    }


    loadConfirmAlert = (action, record) => {
        if (action === "add"){
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className='custom-ui'>
                            <h1>Add New Record</h1>
                            <div className="information">
                                <label>Title:</label>
                                <input type="text" onChange={(event)=>{this.setState({title:event.target.value})}}/>
                                
                                <label>Url:</label>
                                <input type="text" onChange={(event)=>{this.setState({url:event.target.value})}}/>
                                
                                <label>Description:</label>
                                <input type="text" onChange={(event)=>{this.setState({description:event.target.value})}}/>
                            </div>
                            <button className='delete-modal-button' onClick={() => {
                                this.addRecord()
                                onClose()
                            }}>Add</button>
                            <button className='delete-modal-button' onClick={onClose}>Close</button>
                        </div>
                    )
                }
            }) 
        } else if (action === "update"){
            this.setState({
                title:record.title
            })
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className='custom-ui'>
                            <h1>Update Record</h1>
                            <div className="information">
                                <label>Title:</label>
                                <input type="text" value={record.title} disabled/>

                                <label>Url:</label>
                                <input type="text" value={record.url} disabled/>

                                <label>Description:</label>
                                <input type="text" defaultValue={record.description} onChange={(event)=>{
                                    this.setState({description:event.target.value})
                                }}/>
                            </div>
                            <button className='delete-modal-button' onClick={() => {
                                this.updateRecord()
                                onClose()
                            }}>Update</button>
                            <button className='delete-modal-button' onClick={onClose}>Close</button>
                        </div>
                    )
                }
            }) 
        } else { // action === "delete"
            this.setState({
                title:record.title
            })
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className='custom-ui'>
                            <h1>Delete Record</h1>
                            <p>Are you sure to delete this record?</p>
                            <button className='delete-modal-button' onClick={() => {
                                this.deleteRecord()
                                onClose()
                            }}>Yes</button>
                            <button className='delete-modal-button' onClick={onClose}>No</button>
                        </div>
                    )
                }
            }) 
        }

    }
    
    render() {
        return (
            <div>
                <div className="shiftLeft">
                    <a href="/"><button className="btn btn-primary">Back to Search</button></a>
                </div>
                <div className="shiftRight">
                    <button className="btn btn-primary" onClick={()=>this.loadConfirmAlert("add", null)}>Add New Record</button>
                </div>

                <div className="datatable">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">URL</th>
                                <th scope="col">Description</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data && this.state.data.map((details) => (
                                <tr>
                                <td>{details.title}</td>
                                <td>{details.url}</td>
                                <td>{details.description}</td>
                                <td>
                                    <div className="btn-grp">
                                        <button className="btn btn-warning" onClick={()=>this.loadConfirmAlert("update", details)}>Update</button>
                                        <button className="btn btn-danger" onClick={()=>this.loadConfirmAlert("delete", details)}>Delete</button>
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