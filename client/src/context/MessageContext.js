import {createContext, useContext} from 'react'


export const MessageContext = createContext({
    author: null,
    text: null,
    date: null,
    ttl: -1
})
