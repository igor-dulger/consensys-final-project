import React, { Component } from 'react'
import shopService from '../services/Shop'
import { withAlert } from 'react-alert'
import dataProvider from '../services/DataProvider'
import ProductBuy from './ProductBuy'
import Helpers from '../utils/Helpers'

class ShowProduct extends Component {
    constructor(props) {
        super(props)

        this.state = {
            address: props.match.params.address,
            name: '',
            price: '',
            quantity: '',
            image: '',
        }
        this.events = {}
    }

    componentWillMount() {
        this.getProduct(this.props.match.params.id)
        this.addWatchers()
    }

    componentWillUnmount() {
        Helpers.stopWatchers(this.events)
    }

    addWatchers() {

        this.events.productDeleted = shopService.getWatcherProductDeleted()
        this.events.productDeleted.watch( (err, result) => {
            if (result.args.id.toString() === this.props.match.params.id) {
                window.location.replace(this.props.history.goBack())
            }
        })
        this.events.productEdited = shopService.getWatcherProductEdited()
        this.events.productEdited.watch( (err, result) => {
            this.getProduct(this.props.match.params.id)
        })
        this.events.productQuantityDecreased = shopService.getWatcherProductQuantityDecreased()
        this.events.productQuantityDecreased.watch( (err, result) => {
            this.getProduct(this.props.match.params.id)
        })
        this.events.productSold = shopService.getWatcherProductSold()
        this.events.productSold.watch( (err, result) => {
            this.props.alert.success('Product was sold')
            this.getProduct(this.props.match.params.id)
        })

    }

    getProduct(id) {
        shopService.getProduct(id).then(result => {
            console.log("Get product", id, result)
            const rowId = result[0].toString()
            this.setState({
                id: rowId,
                name: result[1],
                price: dataProvider.web3.fromWei(result[2]).toString(),
                quantity: result[3].toString(),
                image: result[4],
                wantToBuy: 1,
            })

        }).catch((error) => {
            console.log("Can't get product.")
        })
    }

    render() {
        console.log("Show product render", this.props)
        var imageUrl = dataProvider.ipfsUrl + this.state.image

        return (
            <div>
                <h1>Product view</h1>

                <div className="pure-g">
                    <div className="pure-u-1-3"></div>
                    <div className="pure-u-1-3">
                        <div className="pure-u-1">{this.state.image && <img src={imageUrl} alt="product"/>}</div>
                        <div className="pure-u-1-2"><p>Name</p></div>
                        <div className="pure-u-1-2"><p>{this.state.name}</p></div>
                        <div className="pure-u-1-2"><p>Price</p></div>
                        <div className="pure-u-1-2"><p>{this.state.price} ether</p></div>
                        <div className="pure-u-1-2"><p>Quantity</p></div>
                        <div className="pure-u-1-2"><p>{this.state.quantity}</p></div>
                        <div className="pure-u-1">
                            <ProductBuy id={this.state.id} price={this.state.price}/>
                        </div>
                    </div>
                    <div className="pure-u-1-3"></div>
                </div>
            </div>
        )
    }
}

export default withAlert(ShowProduct)
