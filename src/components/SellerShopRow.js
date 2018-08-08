import React, { Component } from 'react'

class SellerShopRow extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    render() {
        var link = "/shop/" + this.props.id
        return (
            <tr className="pure-table-odd">
                <td>{this.props.id}</td>
                <td>{this.props.name}</td>
                <td>{this.props.description}</td>
                <td><a href={link} className="">Manage</a></td>
                <td><button className="button-error pure-button" onClick={this.props.onDeleteClick}>Delete</button></td>
            </tr>
        );
    }
}

export default SellerShopRow
