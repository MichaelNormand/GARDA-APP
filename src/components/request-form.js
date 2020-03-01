import React from 'react'
import './request-form.css'

export default class RequestForm extends React.Component {
    constructor() {
        super()
        this.state = {
            date: undefined,
            id: undefined,
            phone: undefined,
            error: false
        }
    }
    render() {
        return (
            <div className={'request-messages-container' + (this.props.open === true ? ' open' : '')}>
                <div className="request-messages-modal">
                    <button id="close" onClick={this.handleCloseModal}>
                        x
                    </button>
                    <h1>Obtenion de messages</h1>
                    <div className={'request-form-error' + (this.state.error === true ? ' show' : '')}>
                        <p>Veuillez remplir tous les champs du formulaire.</p>
                    </div>
                    <label>Date de Départ:</label>
                    <input autoComplete="off" type="date" id="date" onInput={this.handleDateInput} valid={this.state.date === undefined ? 'unknown' : this.state.date.length > 0 ? 'true' : 'false'} />
                    <label>ID du premier message:</label>
                    <input autoComplete="off" id="id" onInput={this.handleIDInput} valid={this.state.id === undefined ? 'unknown' : this.state.id.length > 0 ? 'true' : 'false'} />
                    <label>Numéro de téléphone:</label>
                    <input autoComplete="off" type="number" id="phone" onInput={this.handlePhoneInput} valid={this.state.phone === undefined ? 'unknown' : this.state.phone.length > 0 ? 'true' : 'false'} />
                    <button onClick={this.handleClick}>Obtenir</button>
                </div>
            </div>
        )
    }
    handleDateInput = event => {
        this.setState({ date: event.target.value })
    }
    handleIDInput = event => {
        this.setState({ id: event.target.value })
    }
    handlePhoneInput = event => {
        this.setState({ phone: event.target.value })
    }
    handleCloseModal = () => {
        let requestMessageContainer = document.querySelector('.request-messages-container')
        if (requestMessageContainer.classList.contains('open')) {
            requestMessageContainer.classList.toggle('open')
        }
        if (!requestMessageContainer.classList.contains('close')) {
            requestMessageContainer.classList.toggle('close')
        }
        setTimeout(() => {
            requestMessageContainer.classList.toggle('close')
            this.props.onModalClose()
        }, 300)
    }
    handleClick = () => {
        if (this.state.date === undefined || this.state.id === undefined || this.state.phone === undefined) {
            this.setState({
                date: this.state.date === undefined ? '' : this.state.date,
                id: this.state.id === undefined ? '' : this.state.id,
                phone: this.state.phone === undefined ? '' : this.state.phone,
                error: true
            })
            return
        }
        if (this.state.date.length <= 0 || this.state.id.length <= 0 || this.state.phone.length <= 0) {
            this.setState({ error: true })
            return
        }
        this.setState({error: false})
        let requestMessageContainer = document.querySelector('.request-messages-container')
        if (requestMessageContainer.classList.contains('open')) {
            requestMessageContainer.classList.toggle('open')
        }
        if (!requestMessageContainer.classList.contains('close')) {
            requestMessageContainer.classList.toggle('close')
        }
        setTimeout(() => {
            requestMessageContainer.classList.toggle('close')
            this.props.onModalSubmit(this.state.date, this.state.id, this.state.phone)
        }, 300)
    }
}
