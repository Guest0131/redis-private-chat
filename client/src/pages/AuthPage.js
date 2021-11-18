import React, {useState, useEffect, useContext} from 'react';
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'

export const AuthPage = () => {

    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()

    const [form, setForm] = useState({
        username : '', password : ''
    })
    
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('api/auth/register', 'POST', {...form})
            message(data.message)
        } catch (e) { }
    }

    const loginHandler = async () => {
        try {
            const data = await request('api/auth/login', 'POST', {...form})
            auth.login(data.token, data.username)
        } catch (e) { }
    }


    return (
        <div className="row">
            <div className="col s6 offset-s3" style={{margin: '20% 25%'}}>
                
                <div className="card blue-grey darken-3">
                    <div className="card-content white-text">
                        <span className="card-title">Redis PRIVATE CHAT</span>
                        <div>

                            <div className="input-field">
                                <input 
                                    type="text" 
                                    placeholder="Введите логин" 
                                    id="login"
                                    name="username"
                                    onChange={changeHandler}
                                    />
                                <label htmlFor="login">Логин</label>
                                
                            </div>
                            <div className="input-field">
                                
                                <input 
                                    type="password" 
                                    placeholder="Введите пароль" 
                                    id="password"
                                    name="password"
                                    onChange={changeHandler}
                                    />
                                <label htmlFor="password">Пароль</label>
                                
                            </div>

                        </div>

                    </div>
                    <div className="card-action">
                        <button 
                            className="btn green darken-2" 
                            style={{marginRight: 10}}
                            disabled={loading}
                            onClick={loginHandler}
                            >
                                Войти
                        </button>
                        <button 
                            className="btn grey darken-1"
                            onClick={registerHandler}
                            disabled={loading}
                            >
                                Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}