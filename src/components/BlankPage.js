import React, { Component } from 'react'

class BlankPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <h1>{this.props.message}</h1>
        );
    }
}

export default BlankPage
