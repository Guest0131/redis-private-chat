import React, {useState, useEffect, useContext} from "react";
import { AuthContext } from '../context/AuthContext'
var request = require('sync-request');


export const ChatBox = (props) => {

    const handleNewMessage = () => {
        window.M.toast({html: document.getElementById("newMessage").value,  loader: true});
    }

    return (
        <div className="col s8">
            <ul class="collection chat">
                <li class="chat-item collection-item">{props.title}</li>
            </ul>
            <div className="col s12 chat-box">
                {props.messages}
            </div>
            <div className="col s12">
                <div className="input-field col s12">
                    <a 
                        class="btn-floating grey darken-3 prefix" 
                        style={{
                            width: '50px',
                            height: '50px',
                            padding: '5px 0',
                        }}
                        onClick={handleNewMessage}
                    >
                        <i class="material-icons">send</i>
                    </a>
                    
                    <textarea 
                        id="newMessage"
                        className="materialize-textarea" 
                        style={{
                            width: '90%',
                            float: 'right'
                        }}
                    > </textarea> 
                </div>
               
            </div>
        </div>
    );
}