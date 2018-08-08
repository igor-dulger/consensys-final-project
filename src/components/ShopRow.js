import React, { Component } from 'react'

class ShopRow extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    render() {
        var link = "/shop/" + this.props.address
        return (
            <tr className={this.props.index % 2 == 1 ? "pure-table-odd" : ""} >
                <td>{this.props.id}</td>
                <td><a href={link}>{this.props.name}</a></td>
                <td>{this.props.description}</td>
            </tr>
        );
    }
}

export default ShopRow
