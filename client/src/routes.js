import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import { MainPage } from "./pages/MainPage"
import { MessagePage } from "./pages/MessagePage"
import { AuthPage } from "./pages/AuthPage"

export const useRoutes = isAuthentificated => {
    if (isAuthentificated) {
        return (
            <Switch>
                <Route path="/" exact>
                    <MainPage></MainPage>
                </Route>
                <Route path="/message" exact>
                    <MessagePage></MessagePage>
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