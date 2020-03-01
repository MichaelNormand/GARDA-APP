import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Form from './components/form'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import MessageList from './components/message-list'

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/">
                <Form />
            </Route>
            <Route exact path="/messages">
                <MessageList />
            </Route>
            <Route path='*' exact={true}>
                <Form />
            </Route>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
)
