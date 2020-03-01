import React from 'react'
import { withRouter } from 'react-router-dom'
import Message from './message'
import RequestForm from './request-form'
import SendForm from './send-form'
import Popup from './popup'
import shortid from 'shortid'
import './message-list.css'

class MessageList extends React.Component {
    constructor() {
        super()
        this.state = {
            messages: undefined,
            openRequestModal: false,
            openSendModal: false,
            loading: true,
            showConfirmationAlert: false,
            showErrorAlert: false
        }
    }
    componentDidMount() {
        this.checkToken()
            .then(() => {
                this.setState({ loading: false })
            })
            .catch(() => {
                this.setState({ loading: false, showErrorAlert: true })
            })
    }

    checkToken = () => {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:5000/authentication/check-token', {
                method: 'POST',
                headers: new Headers({
                    Authorization: localStorage['garda-token']
                })
            })
                .then(message => {
                    message
                        .json()
                        .then(response => {
                            if (response === undefined || response.valid === false) {
                                localStorage.removeItem('garda-token')
                                this.props.history.push('/')
                                reject()
                                return
                            }
                            resolve()
                        })
                        .catch(() => {
                            localStorage.removeItem('garda-token')
                            this.props.history.push('/')
                            reject()
                        })
                })
                .catch(() => {
                    localStorage.removeItem('garda-token')
                    this.props.history.push('/')
                    reject()
                })
        })
    }
    getMessages = body => {
        let serverError = false
        let serverMessages = undefined
        let bodyJson = JSON.stringify(body)
        this.setState({ loading: true })
        new Promise((resolve, reject) => {
            this.checkToken()
                .then(() => {
                    fetch('http://localhost:5000/messages', {
                        method: 'POST',
                        body: bodyJson,
                        headers: new Headers({
                            Authorization: localStorage['garda-token'],
                            'Content-Type': 'application/json'
                        })
                    })
                        .then(rawMessages => {
                            rawMessages
                                .json()
                                .then(messages => {
                                    if (messages.tokenValid !== undefined && messages.tokenValid === false) {
                                        localStorage.removeItem('garda-token')
                                        this.props.history.push('/')
                                        reject()
                                        return
                                    }
                                    if (messages.error !== undefined && messages.error === true) {
                                        serverError = true
                                        serverMessages = undefined
                                        reject()
                                        return
                                    }
                                    serverMessages = messages
                                    resolve()
                                })
                                .catch(() => {
                                    serverError = true
                                    reject()
                                })
                        })
                        .catch(() => {
                            serverError = true
                            reject()
                        })
                })
                .catch(() => {
                    localStorage.removeItem('garda-token')
                    this.props.history.push('/')
                    reject()
                })
        })
            .catch(() => {})
            .finally(() => {
                this.setState({ showErrorAlert: serverError, messages: serverMessages, loading: false })
            })
    }
    sendMessage = (origin, target, message) => {
        let success = true
        this.setState({ loading: true })
        new Promise((resolve, reject) => {
            this.checkToken()
                .then(() => {
                    let bodyJson = JSON.stringify({ origin: origin, target: target, message: message })
                    fetch('http://localhost:5000/messages/send', {
                        method: 'POST',
                        body: bodyJson,
                        headers: new Headers({
                            Authorization: localStorage['garda-token'],
                            'Content-Type': 'application/json'
                        })
                    })
                        .then(rawMessages => {
                            rawMessages
                                .json()
                                .then(messages => {
                                    if (messages.tokenValid !== undefined && messages.tokenValid === false) {
                                        localStorage.removeItem('garda-token')
                                        this.props.history.push('/')
                                        reject()
                                        return
                                    }
                                    if (messages.error !== undefined && messages.error === true) {
                                        success = false
                                        reject()
                                        return
                                    }
                                    resolve()
                                })
                                .catch(() => {
                                    success = false
                                    reject()
                                })
                        })
                        .catch(() => {
                            success = false
                            reject()
                        })
                })
                .catch(() => {
                    localStorage.removeItem('garda-token')
                    this.props.history.push('/')
                    success = false
                    reject()
                })
        })
            .catch(() => {})
            .finally(() => {
                this.setState({ serverErrors: !success, showConfirmationAlert: success, showErrorAlert: !success, loading: false })
            })
    }
    render() {
        return (
            <div>
                <Popup
                    content="Une erreur est survenue, veuillez réessayer cette fonctionnalité plus tard."
                    title="Erreur"
                    error={true}
                    open={this.state.showErrorAlert}
                    onClose={this.handlePopupErrorQuit}
                />
                <Popup content="L'opération demandée s'est terminée avec succès!" title="Succès" error={false} open={this.state.showConfirmationAlert} onClose={this.handlePopupSuccessQuit} />
                <RequestForm key={shortid.generate()} open={this.state.openRequestModal} onModalClose={this.handleRequestModalClose} onModalSubmit={this.handleRequestModalSubmit} />
                <SendForm key={shortid.generate()} open={this.state.openSendModal} onSendClose={this.handleSendCloseEvent} onSendSubmit={this.handleSendSubmitEvent} />
                <div className={'message-list-container-loading' + (this.state.loading === true ? ' open' : ' close')}>
                    <span className="loader">
                        <span className="loader-inner"></span>
                    </span>
                </div>
                <div className="messages-container">
                    <div className="button-container">
                        <button className="get-messages-button" onClick={this.handleRequestModalClick}>
                            Obtenir des messages
                        </button>
                        <h1>API Garda Messages</h1>
                        <button className="send-message-button" onClick={this.handleSendModalClick}>
                            Envoyer un message
                        </button>
                    </div>
                    {this.state.messages === undefined || this.state.messages.length <= 0 ? (
                        <h3>Aucun message d'obtenu pour le moment. Utilisez le menu d'obtention de messages pour obtenir vos nouveaux messages.</h3>
                    ) : (
                        this.state.messages.map(message => {
                            return <Message key={shortid.generate()} id={message['@id']} time={message.begintime} from={message.origin} message={message.content} />
                        })
                    )}
                </div>
            </div>
        )
    }
    handleRequestModalClick = () => {
        let modalContainer = document.querySelector('.request-messages-container')
        if (!modalContainer.classList.contains('open')) {
            modalContainer.classList.toggle('open')
        }
        if (modalContainer.classList.contains('close')) {
            modalContainer.classList.toggle('close')
        }
        setTimeout(() => {
            this.setState({ openRequestModal: true })
        }, 300)
    }

    handleRequestModalClose = () => {
        this.setState({ openRequestModal: false })
    }

    handleRequestModalSubmit = (date, id, phone) => {
        this.getMessages({ date: date, id: id, phone: phone })
        this.setState({ openRequestModal: false })
    }
    handleSendCloseEvent = () => {
        this.setState({ openSendModal: false })
    }
    handleSendSubmitEvent = (origin, target, message) => {
        this.sendMessage(origin, target, message)
        this.setState({ openSendModal: false })
    }
    handleSendModalClick = () => {
        let modalContainer = document.querySelector('.send-message-container')
        if (!modalContainer.classList.contains('open')) {
            modalContainer.classList.toggle('open')
        }
        if (modalContainer.classList.contains('close')) {
            modalContainer.classList.toggle('close')
        }
        setTimeout(() => {
            this.setState({ openSendModal: true })
        }, 300)
    }
    handlePopupSuccessQuit = () => {
        this.setState({ showConfirmationAlert: false })
    }
    handlePopupErrorQuit = () => {
        this.setState({ showErrorAlert: false })
    }
}

export default withRouter(MessageList)
