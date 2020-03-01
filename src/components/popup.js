import React from 'react'
import './popup.css'

export default class Popup extends React.Component {
    render() {
        return (
            <div className={'popup-container' + (this.props.open === true ? ' open' : '')}>
                <div className={'modal' + (this.props.error === true ? ' error' : ' success')}>
                    <div className="top">
                        <p>{this.props.title}</p>
                        <button onClose={this.handleClick}>X</button>
                    </div>
                    <div className="content">
                        <p>{this.props.content}</p>
                    </div>
                    <div className="bottom">
                        <button onClick={this.handleClick}>Fermer</button>
                    </div>
                </div>
            </div>
        )
    }

    handleClick = () => {
        let popupContainer = document.querySelector('.popup-container')
        if (popupContainer.classList.contains('open')) {
            popupContainer.classList.toggle('open')
        }
        if (!popupContainer.classList.contains('close')) {
            popupContainer.classList.toggle('close')
        }
        setTimeout(() => {
            popupContainer.classList.toggle('close')
            this.props.onClose()
        })
    }
}
