import {useState, useCallback} from 'react'


export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)


    const request = useCallback(async (url, method = 'GET', body = null , headers = {}) => {
        setLoading(true)
        
        try {

            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }

            const response = await fetch(new Request(url, { method, body, headers }))
            const data = await response.json()
            console.log(data)
            if (!response.ok) {
                if (data.errors) {
                    for (var er of data.errors) { setError(er.msg) }
                } else {
                    throw new Error(data.message || 'Что-то пошло не так')
                }
                
            } else {
                setError(data.message)
            }

            setLoading(false)

            return data
        } catch (e) {
            setLoading(false)
            
            setError(e.message)
            throw e
        }
    }, [])
    

    const clearError = useCallback(() => { setError(null) }, [])

    return { loading, request, error, clearError }
}