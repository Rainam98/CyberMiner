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
                            <div className="form-group">
                            <h1>Add New Record</h1>
                            
                                <label>Title:</label>
                                <input type="text" className="form-control" onChange={(event)=>{this.setState({title:event.target.value})}}/>
                                
                                <label>Url:</label>
                                <input type="text" className="form-control" onChange={(event)=>{this.setState({url:event.target.value})}}/>
                                
                                <label>Description:</label>
                                <textarea rows="3" className="form-control" onChange={(event)=>{this.setState({description:event.target.value})}}/>
                            </div>
                            <div className="buttons">
                            <button className='btn btn-success delete-modal-button' onClick={() => {
                                if(this.state.url && this.state.title && this.state.description){
                                    this.addRecord()
                                    onClose()
                                }else{
                                    alert("Please enter all data")
                                }
                            }}>Add</button>
                            <button className='btn btn-danger delete-modal-button' onClick={onClose}>Close</button>
                            </div>
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
                            <div className="form-group">
                            <h1>Update Record</h1>
                            <div className="information">
                                
                                <label>Title:</label>
                                <input type="text" className="form-control" value={record.title} disabled/>

                                <label>Url:</label>
                                <input type="text" className="form-control" value={record.url} disabled/>

                                <label>Description:</label>
                                <textarea rows="3" className="form-control" defaultValue={record.description} onChange={(event)=>{
                                    this.setState({description:event.target.value})
                                }}/>
                            </div>
                            <div className="buttons">
                            <button className='btn btn-success delete-modal-button' onClick={() => {
                                this.updateRecord()
                                onClose()
                            }}>Update</button>
                            <button className='btn btn-danger delete-modal-button' onClick={onClose}>Close</button>
                            </div>
                        </div>
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
                            <h1>Delete {record.title}</h1>
                            <p>Are you sure to delete this record?</p>
                            <div className="buttons">
                            <button className='btn btn-success delete-modal-button' onClick={() => {
                                this.deleteRecord()
                                onClose()
                            }}>Yes</button>
                            <button className='btn btn-danger delete-modal-button' onClick={onClose}>No</button>
                            </div>
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
                                <td><a href={details.url} target="_blank">{details.url}</a></td>
                                <td>{details.description}</td>
                                <td>
                                    
                                        <button type="button" className="btn btn-warning table-button" onClick={()=>this.loadConfirmAlert("update", details)}>Update</button>
                                        <button type="button" className="btn btn-danger table-button" onClick={()=>this.loadConfirmAlert("delete", details)}>Delete</button>
                                    
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