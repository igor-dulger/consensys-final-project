import React, { Component } from 'react'

class SellerShopRow extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    render() {
        var link = "/shop/" + this.props.address
        return (
            <tr className="pure-table-odd">
                <td>{this.props.id}</td>
                <td><a href={link} className="">{this.props.name}</a></td>
                <td>{this.props.description}</td>
                <td><button className="button-error pure-button" onClick={this.props.onDeleteClick}>Delete</button></td>
            </tr>
        );
    }
}

export default SellerShopRow
