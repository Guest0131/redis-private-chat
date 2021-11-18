import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import { MainPage } from "./pages/MainPage"

import { AuthPage } from "./pages/AuthPage"

export const useRoutes = isAuthentificated => {
    if (isAuthentificated) {
        return (
            <Switch>
                <Route path="/" exact>
                    <MainPage></MainPage>
                </Route>
                <Redirect to="/" exact></Redirect>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage></AuthPage>
            </Route>
            <Redirect to="/" exact></Redirect>
        </Switch>
    )
}