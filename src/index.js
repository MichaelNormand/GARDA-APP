import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import LoginForm from './components/login-form'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import MessageList from './components/message-list'

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/">
                <LoginForm />
            </Route>
            <Route exact path="/messages">
                <MessageList />
            </Route>
            <Route path='*' exact={true}>
                <LoginForm />
            </Route>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
)
