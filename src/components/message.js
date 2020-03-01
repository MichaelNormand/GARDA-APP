import React from 'react'
import './message.css'

export default class Message extends React.Component {
    render() {
        let year = this.props.time.substring(0, 4)
        let month = this.props.time.substring(4, 6)
        let day = this.props.time.substring(6, 8)
        let hour = this.props.time.substring(9, 11)
        let minute = this.props.time.substring(11, 13)
        let seconds = this.props.time.substring(13, 15)
        return (
            <div className="message">
                <small>{this.props.from + ' (' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds + ')'}</small>
                <p>
                    {this.props.message} <small>({this.props.id})</small>
                </p>
            </div>
        )
    }
}
