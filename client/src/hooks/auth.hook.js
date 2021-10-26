import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {

    const [token, setToken] = useState(null)
    const [username, setUsername] = useState(null)

    const login = useCallback((jwtToken, uname) => {
        setToken(jwtToken)
        setUsername(uname)

        localStorage.setItem(storageName, JSON.stringify({
            token: jwtToken, username:uname
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUsername(null)

        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            login(data.token, data.username)
        }
    }, [login])



    return { login, logout, token, username }
}