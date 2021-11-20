import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'

export const ChatBox = (props) => {

    const auth = useContext(AuthContext)
    const {loading, request, error, clearError} = useHttp()
    const ownerChat = false
    if (props.currentChat && auth.username == props.currentChat.owner) {
        const ownerChat = true
    }

    const [text, setSenderText] = useState('')
    const [ttl, setTtl] = useState(60)

    const handleNewMessage = async () => {
        if (text != '' && props.currentChat && props.currentChat.id) {
            try {
                const data = await request('api/message/send_message', 'POST', {
                    'owner': auth.username,
                    'text': text,
                    'chat_id': props.currentChat.id,
                    'ttl': ttl
                })
            } catch (e) {
                console.error(e)
            }
        }
        

        
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
                        <i class="material-icons copy"
                            style={{
                                float: "right"
                            }}
                            onClick={() => {
                                window.M.toast({ html: "Ключ для доступа в беседу скопирован в буфер обмена" })
                                navigator.clipboard.writeText(props.currentChat.key, true);
                            }}

                        >content_paste</i>
                    }
                    <br />
                    {
                        !props.currentChat.members ||
                        <div>
                            <button data-target="modal1" class="btn modal-trigger btn-member">
                                Количество участников:  {props.currentChat.members.length}
                            </button>

                            <div id="modal1" class="modal">
                                <div class="modal-content">
                                    <h4>Список участников беседы: <i>{props.currentChat.name}</i></h4>
                                    <ul class="collection">
                                            {Array.prototype.map.call(props.currentChat.members, function (member) {
                                                return <li className="collection-item">
                                                        <img src={"static/img/avatar.png"} class="circle" width="40px" style={{
                                                            float: "left",
                                                            marginTop: "-10px"

                                                        }}/>
                                                        {member}
                                                        
                                                        </li>
                                            })}
                                            
                                       
                                    </ul>
                                </div>

                            </div>

                            {window['startListener']()}
                        </div>
                    }

                </li>
            </ul>
            <div className="col s12 chat-box">
                {props.messages ||
                    <div id="gameBox">
                        <div id="putgamehere"></div>
                        <button id="btnGame" style={{ marginLeft: "42%" }} class="btn black" onClick={window["startMiniGame"]}>SUPER GAME</button>
                    </div>}
            </div>
            <div className="col s12">
                <div className="input-field col s12">
                    <a
                        id="sendNewMessage"
                        class="btn-floating grey darken-3 prefix"
                        style={{
                            width: '50px',
                            height: '50px',
                            padding: '5px 0',
                        }}
                        onClick={() => {
                            handleNewMessage()
                            document.getElementById("newMessage").value = ""
                            setSenderText("")
                        }}
                    >
                        <i class="material-icons">send</i>
                    </a>

                    <textarea
                        id="newMessage"
                        className="materialize-textarea" 
                        onChange={
                            () => {
                                setSenderText(document.getElementById("newMessage").value)
                            }
                        }
                    ></textarea>
                    <input 
                        type="number" 
                        id="newMessageTtl" 
                        value={ttl}
                        onChange={() => {setTtl(document.getElementById("newMessageTtl").value)}}
                    />
                </div>

            </div>
        </div>
    );
}