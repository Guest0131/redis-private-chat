import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from '../context/AuthContext'
var request = require('sync-request');


export const ChatBox = (props) => {

    const auth = useContext(AuthContext)
    const ownerChat = false
    if (props.currentChat && auth.username == props.currentChat.owner) {
        const ownerChat = true
    }

    const [text, setText] = useState('')

    const handleNewMessage = async () => {
        try {
            
            const data = await request('api/message/send_message', 'POST', {
                'owner' : auth.username,
                'text' : text,
                'chatId': props.currentChat.id,
                'ttl' : 10
            })
        } catch (e) {
            console.error(e)
         }

        //window.location.reload()
    }
    return (
        <div className="col s8">
            <ul class="collection chat">
                <li class="chat-item collection-item" style={{
                    textAlign: "center"
                }}>
                    {props.currentChat.name || "Выберите чат"} 
                    {
                        (!props.currentChat.name && !ownerChat) || 
                        <i class="material-icons" 
                        style={{
                            float: "right"
                        }}
                        onClick={() => {
                            window.M.toast({html: "Ключ для доступа в беседу скопирован в буфер обмена"})
                            navigator.clipboard.writeText(props.currentChat.key, true);
                        }}
                        
                        >content_paste</i>
                    }
                
                </li>
            </ul>
            <div className="col s12 chat-box">
                {props.messages ||
                    <div id="gameBox">
                        <div id="putgamehere"></div>
                        <button id="btnGame" style={{marginLeft: "42%"}} class="btn black" onClick={window["startMiniGame"]}>SUPER GAME</button>
                    </div>}
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
                        onChange={
                            () => {
                                setText(document.getElementById("newMessage").value)
                            }
                        }
                    > </textarea>
                </div>

            </div>
        </div>
    );
}