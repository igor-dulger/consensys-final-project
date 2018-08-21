import React, { Component } from 'react'
import ProductBuy from './ProductBuy'
import { Link } from 'react-router-dom';

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
                <td><Link to={this.props.link}>{this.props.name}</Link></td>
                <td>{this.props.price}</td>
                <td><Link to={this.props.editLink}><button className="button-secondary pure-button">Edit</button></Link></td>
                <td><button className="button-warning pure-button" onClick={this.props.onDeleteClick}>Delete</button></td>
                <td>{this.props.quantity}</td>
                <td valign="center"><ProductBuy id={this.props.id} price={this.props.price}/></td>
            </tr>
        );
    }
}

export default ProductRowManage
