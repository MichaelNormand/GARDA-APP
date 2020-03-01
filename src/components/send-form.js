import React from 'react'
import './send-form.css'

export default class SendForm extends React.Component {
    constructor() {
        super()
        this.state = {
            origin: undefined,
            target: undefined,
            message: undefined,
            error: false
        }
    }
    render() {
        return (
            <div className={'send-message-container' + (this.props.open === true ? ' open' : '')}>
                <div className="send-message-modal">
                    <button id="close" onClick={this.handleCloseClick}>X</button>
                    <h1>Envoi de message</h1>
                    <div className={'send-message-error' + (this.state.error === true ? ' show' : '')}>
                        <p>Veuillez remplir tous les champs.</p>
                    </div>
                    <label>Numéro Maître:</label>
                    <input autoComplete="off" id="origin-number" onInput={this.handleOriginInput} type="number" valid={this.state.origin === undefined ? 'unknown' : this.state.origin.length > 0 ? 'true' : 'false'} />
                    <label>Numéro Cible:</label>
                    <input autoComplete="off" id="target-number" onInput={this.handleTargetInput} type="number" valid={this.state.target === undefined ? 'unknown' : this.state.target.length > 0 ? 'true' : 'false'} />
                    <label>Message:</label>
                    <textarea autoComplete="off"
                        id="message"
                        onInput={this.handleMessageInput}
                        rows="5"
                        valid={this.state.message === undefined ? 'unknown' : this.state.message.length > 0 ? 'true' : 'false'}
                    ></textarea>
                    <button onClick={this.handleSubmitClick}>Envoyer</button>
                </div>
            </div>
        )
    }
    handleCloseClick = () => {
        let sendMessageContainer = document.querySelector('.send-message-container')
        if (sendMessageContainer.classList.contains('open')) {
            sendMessageContainer.classList.toggle('open')
        }
        if (!sendMessageContainer.classList.contains('close')) {
            sendMessageContainer.classList.toggle('close')
        }
        setTimeout(() => {
            sendMessageContainer.classList.toggle('close')
            this.props.onSendClose()
        }, 300)
    }
    handleOriginInput = event => {
        this.setState({ origin: event.target.value })
    }
    handleTargetInput = event => {
        this.setState({ target: event.target.value })
    }
    handleMessageInput = event => {
        this.setState({ message: event.target.value })
    }
    handleSubmitClick = () => {
        if (this.state.origin === undefined || this.state.target === undefined || this.state.message === undefined) {
            this.setState({
                origin: this.state.origin === undefined ? '' : this.state.origin,
                target: this.state.target === undefined ? '' : this.state.target,
                message: this.state.message === undefined ? '' : this.state.message,
                error: true
            })
            return
        }
        if (this.state.origin.length <= 0 || this.state.target.length <= 0 || this.state.message.length <= 0) {
            this.setState({ error: true })
            return
        }
        this.setState({ error: false })
        let sendMessageContainer = document.querySelector('.send-message-container')
        if (sendMessageContainer.classList.contains('open')) {
            sendMessageContainer.classList.toggle('open')
        }
        if (!sendMessageContainer.classList.contains('close')) {
            sendMessageContainer.classList.toggle('close')
        }
        setTimeout(() => {
            sendMessageContainer.classList.toggle('close')
            this.props.onSendSubmit(this.state.origin, this.state.target, this.state.message)
        }, 300)
    }
}
