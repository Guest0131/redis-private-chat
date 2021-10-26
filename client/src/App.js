import React from 'react';
import {BrowserRouter as Router} from "react-router-dom"
import {useRoutes} from './routes'
import {useAuth} from './hooks/auth.hook'
import {AuthContext} from './context/AuthContext'
import {Navbar} from './components/Navbar'

import 'materialize-css'


function App() {
  
  const {token, login, logout, username} = useAuth()
  const isAuthentificated = !!token
  const routes = useRoutes(isAuthentificated)


  return (
    <AuthContext.Provider value={{
      token, username,login, logout, isAuthentificated
    }}>
      <Router>
        { isAuthentificated && <Navbar />}
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
