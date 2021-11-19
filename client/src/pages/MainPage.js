// eslint-disable-next-line
import React, {useState, useEffect, useContext} from 'react';

import { AuthContext } from '../context/AuthContext'

import { ChatSwitcher } from '../components/ChatSwitcher'
import { ChatBox } from '../components/ChatBox' 


export const MainPage = () => {
    // eslint-disable-next-line
    const auth = useContext(AuthContext)


    const [curentChat, setCurrentChat] = useState(false)
    
    return (
        <div className="row" style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)"
        }}>

            <ChatSwitcher 
                chat={curentChat}
                chatSwitcher={setCurrentChat}
            />
            <ChatBox 
                currentChat={curentChat}
            />

        </div>
    )
}