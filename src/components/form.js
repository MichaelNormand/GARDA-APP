import React from 'react'
import './form.css'
import { withRouter } from 'react-router-dom'

class Form extends React.Component {
    constructor() {
        super()
        this.state = {
            username: null,
            password: null,
            serverError: false,
            credentialsError: false
        }
    }
    componentWillMount() {
        if (localStorage.getItem('garda-token') !== null) {
            this.props.history.push('/messages')
        }
    }
    render() {
        return (
            <div className="login-container">
                <div className="form-container">
                    <h1>Garda API Test</h1>
                    <div className={'notification-container' + (this.state.serverError === true || this.state.credentialsError === true ? ' show' : '')}>
                        <p id="server-error" className={this.state.serverError === true ? 'show' : ''}>
                            Une erreur est survenue.
                        </p>
                        <p id="credentials-error" className={this.state.credentialsError === true ? 'show' : ''}>
                            Votre nom d'utilisateur ou mot de passe est incorrect.
                        </p>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <label>Usename:</label>
                        <input
                            type="text"
                            id="username"
                            valid={
                                this.state.username === null ? 'unknown' : this.state.username.length <= 0 ? 'false' : 'true'
                            }
                            onInput={this.handleUsernameChange}
                            autoFocus
                            autoComplete="off"
                        />
                        <label>Password:</label>
                        <input
                            type="password"
                            id="password"
                            valid={
                                this.state.password === null ? 'unknown' : this.state.password.length <= 0 ? 'false' : 'true'
                            }
                            onInput={this.handlePasswordChange}
                            required
                        />
                        <button type="submit" onClick={this.handleSubmit} id="connect-button">
                            Se Connecter
                        </button>
                    </form>
                </div>
            </div>
        )
    }
    handleSubmit = event => {
        event.preventDefault()
        fetch('http://localhost:5000/authentication', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
            .then(response => {
                response
                    .json()
                    .then(status => {
                        if (status.authenticated === true) {
                            this.setState({ credentialsError: false, serverError: false })
                            localStorage.setItem('garda-token', status.token)
                            this.props.history.push('/messages')
                        } else if (status.authenticated === false) {
                            this.setState({ credentialsError: true, serverError: false })
                        } else if (status.authenticated === null) {
                            this.setState({ credentialsError: false, serverError: true })
                        }
                    })
                    .catch(() => {
                        this.setState({ credentialsError: false, serverError: true })
                    })
            })
            .catch(error => {
                this.setState({ credentialsError: false, serverError: true })
            })
    }
    handleUsernameChange = event => {
        this.setState({ username: event.target.value })
    }
    handlePasswordChange = event => {
        this.setState({ password: event.target.value })
    }
}

export default withRouter(Form)
