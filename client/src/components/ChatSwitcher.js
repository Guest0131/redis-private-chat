import React, {useState, useEffect} from "react";
import {useHttp} from '../hooks/http.hook'
import {CreateChat} from "./CreateChat"



export const Switch = (props) => {
    var selected ='chat-item collection-item switcher'
    if (props.currentChat != null && props.currentChat.name == props.chatName) {
        selected = 'chat-item collection-item grey lighten switcher'
    } else {
        selected = 'chat-item collection-item switcher'
    }
    
    
    return (
        <li id={props.id} className={selected}
            onClick={ () => {
                    for (var c of props.chatsData) {
                        if (c['id'] == props.id) {
                            props.chatSwitcher(c)
                        }
                    }
                }
            }>
                {props.chatName}
        </li>
    )
}

export const ChatSwitcher = (props) => {
    
    const {loading, request, error, clearError} = useHttp()
   
    var [swithches, setSwitches] = useState([])
    var [renderSwitches, setRenderSwitches] = useState([])

    const chatsLoader = async () => {
        try {
            const data = await request('api/message/get_all_chats', 'POST')
            setSwitches(data)

            var tmpResult = []
            for(var c of data) {
               
                if (c.members.includes(props.auth.username)) {
                    tmpResult.push(
                        <Switch 
                            id={c['id']}
                            chatName={c['name']}
                            currentChat={props.chat}
                            chatSwitcher={props.chatSwitcher}
                            chatsData={data}
                        />)
                }
                
            }
            setRenderSwitches(tmpResult)
            if (props.chat) {
                findChatHandler()
            }
            


        } catch (e) { }
    }

    
    

    

    const findChatHandler = () => {
        var tmpResult = []
        var needleChat = document.getElementById("searchInput").value
        
        for (var c of swithches) {
            if ((c['name'].indexOf(needleChat) != -1 && c.members.includes(props.auth.username)) || c['key'] == needleChat) {
                tmpResult.push(
                    <Switch 
                        id={c['id']}
                        chatName={c['name']}
                        currentChat={props.chat}
                        chatSwitcher={props.chatSwitcher}
                        chatsData={swithches}
                    />)
            }
        }

        setRenderSwitches(tmpResult)
    }

    useEffect(async () =>{
        chatsLoader()
        
        try {
            if (props.chat) {
                window['stopGameAndDropButton']()
            }
            
        } catch (e) { }
        
        
    }, [props])

    
    
    

    return (
    <div className="col s4">
        <div className="input-field col s12">
            <i class="material-icons prefix">search</i>
            <textarea id="searchInput" className="materialize-textarea" style={{width: '70%'}} onChange={findChatHandler}></textarea>
            <label for="textarea1">Find chat</label>

            <button data-target="modalChat" class="btn-floating btn-small waves-effect waves-light black modal-trigger" style={{
                marginTop: "-50px",
                marginLeft: "5px"
            }}>
                <i class="material-icons">add</i>
            </button>
        </div>
        <ul className="collection chat" >
            {renderSwitches}
        </ul>

        <CreateChat />
        {window['startListener']()}
        
    </div>
    );
}