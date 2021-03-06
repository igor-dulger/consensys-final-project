import React, { Component } from 'react'
import { Link } from "react-router-dom";

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
                <td><Link to={link} className="">{this.props.name}</Link></td>
                <td>{this.props.description}</td>
                <td><button className="button-error pure-button" onClick={this.props.onDeleteClick}>Delete</button></td>
            </tr>
        );
    }
}

export default SellerShopRow
