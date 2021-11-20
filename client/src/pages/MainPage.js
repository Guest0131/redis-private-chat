// eslint-disable-next-line
import React, { useState, useEffect, useContext, useCallback } from 'react';
import socketIOClient from "socket.io-client";

import { AuthContext } from '../context/AuthContext'

import { ChatSwitcher } from '../components/ChatSwitcher'
import { ChatBox } from '../components/ChatBox'
import { Message } from '../components/Message'

// $2a$12$JD.AvgLLsBlSFlvfMNh.NuBmHc/dRCOSvPtX99CneCY/2mIPhAhCS

export const MainPage = () => {
    // eslint-disable-next-line
    const auth = useContext(AuthContext)
    const [message, setMessage] = useState(null);
    const [curentChat, setCurrentChat] = useState(false)
    const socket = socketIOClient('http://localhost:5000/', { transports: ['websocket'] });


    socket.on("GetMessages",async (data) => {
        if (curentChat) {
            if (!curentChat.members.includes(auth.username)) {
                socket.emit("SignChat", {
                    'username' : auth.username,
                    'chat_id'  : curentChat.id 
                })
            }
            

            var tmpResult = []
            for (var mes of data) {
                if (mes.chat_id == curentChat.id) {
                    tmpResult.push(
                        <Message
                            author={mes.owner}
                            me={mes.owner == auth.username}
                            text={mes.text}
                            time={mes.time_end}
                        />)
                }
            }

            if (tmpResult.length == 0) {
                setMessage(null)
            } else {
                setMessage(tmpResult)
            }

            
        }
    });
  



    return (
        <div className="row" style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)"
        }}>

            <ChatSwitcher
                chat={curentChat}
                chatSwitcher={setCurrentChat}
                auth={auth}
            />
            <ChatBox
                currentChat={curentChat}
                messages={message}
            />
        </div>
    )
}