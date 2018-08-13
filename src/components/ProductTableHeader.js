import React, { Component } from 'react'

class ProductTableHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <tr>
                <th width="5%">#</th>
                <th width="55%">Name</th>
                <th width="10%">Price</th>
                <th width="10%">Quantity</th>
                <th width="20%"></th>
            </tr>
        );
    }
}

export default ProductTableHeader
