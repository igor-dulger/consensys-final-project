import React, { Component } from 'react'
import ProductBuy from './ProductBuy'

class ProductRowManage extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    render() {
        // console.log("Row manage ", this.props)
        return (
            <tr className={this.props.index % 2 === 1 ? "pure-table-odd" : ""} >
                <td>{this.props.id}</td>
                <td><a href={this.props.link}>{this.props.name}</a></td>
                <td>{this.props.price}</td>
                <td><button className="button-secondary pure-button" onClick={this.props.onEditClick}>Edit</button></td>
                <td><button className="button-warning pure-button" onClick={this.props.onDeleteClick}>Delete</button></td>
                <td>{this.props.quantity}</td>
                <td valign="center"><ProductBuy id={this.props.id} price={this.props.price}/></td>
            </tr>
        );
    }
}

export default ProductRowManage
