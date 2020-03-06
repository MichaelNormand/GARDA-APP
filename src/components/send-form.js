import React from 'react'
import './send-form.css'

export default class SendForm extends React.Component {
    constructor() {
        super()
        this.state = {
            origin: undefined,
            targets: [],
            message: undefined,
            error: false
        }
    }
    render() {
        return (
            <div className={'send-message-container' + (this.props.open === true ? ' open' : '')}>
                <div className="send-message-modal">
                    <button id="close" onClick={this.handleCloseClick}>
                        x
                    </button>
                    <h1>Envoi de message</h1>
                    <div className={'send-message-error' + (this.state.error === true ? ' show' : '')}>
                        <p>Veuillez remplir tous les champs.</p>
                    </div>
                    <label>Numéro Maître:</label>
                    <input
                        autoComplete="off"
                        id="origin-number"
                        onInput={this.handleOriginInput}
                        type="number"
                        valid={this.state.origin === undefined ? 'unknown' : this.state.origin.length > 0 ? 'true' : 'false'}
                    />
                    <div>
                        <label>Numéros Cibles:</label>
                        <button id="add-target" onClick={this.handleAddTargetClick}>
                            +
                        </button>
                    </div>
                    <div id="targets">
                        <ul>
                            {this.state.targets.length > 0 ? this.state.targets.map((target, index) => {
                                return (
                                    <li>
                                        <input
                                            key={index}
                                            autoComplete="off"
                                            id={target.id}
                                            onInput={this.handleTargetInput}
                                            type="number"
                                            valid={target.value === undefined ? 'unknown' : target.value.length > 0 ? 'true' : 'false'}
                                        />
                                        <div className="delete-button-container">
                                            <i
                                                className="fas fa-2x fa-trash-alt"
                                                onClick={() => {
                                                    this.handleDeleteTarget(target.id)
                                                }}
                                            ></i>
                                        </div>
                                    </li>
                                )
                            }) : <li><h4>Aucun numéro de téléphone ajouté.</h4></li>}
                        </ul>
                    </div>
                    <label>Message:</label>
                    <textarea
                        autoComplete="off"
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
    handleDeleteTarget = targetId => {
        this.setState({
            targets: this.state.targets.filter(target => {
                return target.id !== targetId
            })
        })
    }
    handleAddTargetClick = event => {
        event.target.blur()
        this.state.targets.push({ id: 'target-' + this.state.targets.length, value: undefined })
        this.setState({ targets: this.state.targets })
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
        let newArray = this.state.targets.map(target => {
            if (target.id === event.target.id) {
                target.value = event.target.value
            }
            return target
        })
        this.setState({ targets: newArray })
    }
    handleMessageInput = event => {
        this.setState({ message: event.target.value })
    }
    handleSubmitClick = () => {
        let hasAnEmptyFeild = false
        this.state.targets.map(target => {
            if (target.value === undefined || target.value.length <= 0) {
                hasAnEmptyFeild = true
            }
            return target
        })
        if (this.state.origin === undefined || this.state.targets === undefined || this.state.message === undefined || this.state.targets.length <= 0 || hasAnEmptyFeild === true) {
            this.setState({
                origin: this.state.origin === undefined ? '' : this.state.origin,
                targets: this.state.targets.map(target => {
                    target.value = target.value === undefined ? '' : target.value
                    return target
                }),
                message: this.state.message === undefined ? '' : this.state.message,
                error: true
            })
            return
        }
        if (this.state.origin.length <= 0 || this.state.targets.length <= 0 || this.state.message.length <= 0) {
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
            this.props.onSendSubmit(this.state.origin, this.state.targets, this.state.message)
        }, 300)
    }
}
