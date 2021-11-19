import React, { useState, useEffect, useCallback, useContext } from "react";
import {AuthContext} from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'


export const CreateChat = () => {


    const auth = useContext(AuthContext)
    const [chatName, setChatName] = useState("")
    const {loading, request, error, clearError} = useHttp()

    const newChatHandler = async () => {
        try {
            const data = await request('api/message/create_chat', 'POST', {
                'chatName' : chatName,
                'chatOwner': auth.username
            })
        } catch (e) { }

        window.location.reload()
    }
    
    return (
        <div>
            <div id="modalChat" className="modal">
                <div className="modal-content">
                    <h4>Создание чата</h4>
                    <div style={{
                        marginTop: "5%"
                    }}>
                        <div className="input-field">
                            <input
                                type="text"
                                placeholder="Введите название чата"
                                id="newChatName"
                                name="username"
                                onChange={()=> {
                                    setChatName(document.getElementById("newChatName").value)
                                }}
                            />
                            <label htmlFor="login">Название чата</label>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn black lighten-3" onClick={newChatHandler}>
                            Создать
                        </button>
                    </div>

                    {window.M.updateTextFields()}
                </div>
            </div>
        </div>

    )
}