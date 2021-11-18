import React, {useState, useEffect} from "react";

export const Switch = (props) => {
    var [selected, setSelected] = useState('chat-item collection-item')
    if (props.currentChat == props.chatName) {
        setSelected('chat-item collection-item grey lighten')
    }

    useEffect(() =>{
        console.log(props.currentChat)
    }, [props.currentChat])
    
    
    return (
        <li className={selected}
            onClick={ () => {
                    props.chatSwitcher(props.chatName)
                }
            }>
                {props.chatName}
        </li>
    )
}

export const ChatSwitcher = (props) => {
    
    var chatsNames = ["Chat1", "Chat2", "Chat3", "Chat4"]

    var switchesArr = []
    for (var c of chatsNames) {
        switchesArr.push(
            <Switch 
                chatName={c}
                currentChat={props.chat}
                chatSwitcher={props.chatSwitcher}
            />)
    }

    var [swithches, setSwitches] = useState(switchesArr)

    const findChatHandler = () => {
        var tmpResult = []
        for (var c of chatsNames) {
            if (c.indexOf(document.getElementById("searchInput").value) != -1) {
                tmpResult.push(
                    <Switch 
                        chatName={c}
                        currentChat={props.chat}
                        chatSwitcher={props.chatSwitcher}
                    />)
            }
        }

        setSwitches(tmpResult)
    }



    return (
        <div className="col s4">
        <div className="input-field col s12">
            <i class="material-icons prefix">search</i>
            <textarea id="searchInput" className="materialize-textarea" onChange={findChatHandler}></textarea>
            <label for="textarea1">Find chat</label>
        </div>
        <ul className="collection chat" >
            {swithches}
        </ul>
    </div>
    );
}