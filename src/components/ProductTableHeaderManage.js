import React, { Component } from 'react'

class ProductTableHeaderManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <tr>
                <th width="5%">#</th>
                <th width="25%">Product</th>
                <th width="10%">Price</th>
                <th width="10%"></th>
                <th width="10%"></th>
                <th width="10%">Quantity</th>
                <th width="20%"></th>
            </tr>
        );
    }
}

export default ProductTableHeaderManage
