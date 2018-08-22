import React, { Component } from 'react'
import shopService from '../services/Shop'
import { withAlert } from 'react-alert'
import dataProvider from '../services/DataProvider'
import ProductTableHeader from './ProductTableHeader'
import ProductRow from './ProductRow'
import ProductTableHeaderManage from './ProductTableHeaderManage'
import ProductRowManage from './ProductRowManage'
import Helpers from '../utils/Helpers'

class ShopProducts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ready: true,
            owner: '',
            address: props.address,
            id: 0,
            name: '',
            price: 0,
            quantity: 0,
            image: '',
            stopPaging: false,
            isOwner: false,
            list: [],
            pageSize: 20,
            readInProgress: false
        }
        this.events = {}

        this.handleShowMoreClick = this.handleShowMoreClick.bind(this);
        this.handleCreateClick = this.handleCreateClick.bind(this);
        this.getDeleteClickHandler = this.getDeleteClickHandler.bind(this);
        // this.getEditClickHandler = this.getEditClickHandler.bind(this);
    }

    componentWillMount() {
        this.readProducts()
        this.readOptions()
        this.addWatchers()
    }

    componentWillUnmount() {
        Helpers.stopWatchers(this.events)
    }

    addWatchers() {
        console.log("Add shop watchers")

        this.events.productDeleted = shopService.getWatcherProductDeleted()
        this.events.productDeleted.watch( (err, result) => {
            this.readProducts()
        })
        this.events.productAdded = shopService.getWatcherProductAdded()
        this.events.productAdded.watch( (err, result) => {
            this.readProducts()
        })
        this.events.productEdited = shopService.getWatcherProductEdited()
        this.events.productEdited.watch( (err, result) => {
            this.readProducts()
        })
        this.events.productQuantityDecreased = shopService.getWatcherProductQuantityDecreased()
        this.events.productQuantityDecreased.watch( (err, result) => {
            this.readProducts()
        })
        this.events.productSold = shopService.getWatcherProductSold()
        this.events.productSold.watch( (err, result) => {
            this.props.alert.success('Product was sold')
        })
    }

    handleShowMoreClick() {
        if (this.state.list.length){
            this.getNext(this.state.list[this.state.list.length-1].id, 0);
        }
    }
    handleCreateClick(event) {
        window.location.replace(this.props.match.url + "/add")
    }

    getDeleteClickHandler(id) {
        return (event) => {
            if (!confirm("Are you sure that you want to delete this product?")) {
                return
            }
            shopService.deleteProduct(id).then(result => {
                this.props.alert.info('Deleting is in progress pls wait')
                console.log(result)
            }).catch((error) => {
                console.log("Error can't delete product.", error)
            })
        }
    }

    readOptions() {
        shopService.name().then(result => {
            this.setState({
                name: result
            })
        }).catch((error) => {
            console.log("Can't get shop name.")
        })
        shopService.description().then(result => {
            this.setState({
                description: result
            })
        }).catch((error) => {
            console.log("Can't get shop description.")
        })
        shopService.owner().then(result => {
            this.setState({
                owner: result,
                isOwner: result === dataProvider.account
            })
        }).catch((error) => {
            console.log("Can't get shop owner.")
        })
    }

    readProducts() {
        if (this.state.readInProgress) return
        this.setState({
            list: [],
            stopPaging: false,
            readInProgress: true
        })
        this.getNext(0, 0);
    }

    getNext(id, showed) {
        if (showed >= this.state.pageSize) {
            this.setState({readInProgress: false})
            return
        }
        shopService.getNext(id).then(result => {
            console.log("Get next product", id, result)
            const rowId = result[0].toString()
            const row = {
                id: rowId,
                key: rowId,
                name: result[1],
                price: dataProvider.web3.fromWei(result[2]).toString(),
                quantity: result[3].toString(),
                image: result[4],
                wantToBuy: 1,
                link: this.props.match.url + "/product/" + rowId,
                onDeleteClick: this.getDeleteClickHandler(rowId),
                editLink: this.props.match.url + "/edit/" + rowId
            }
            this.getNext(row.id, showed+1)
            let shops = this.state.list
            shops.push(row)
            this.setState({
                list: shops
            })
        }).catch((error) => {
            this.setState({stopPaging: true, readInProgress: false})
            console.log("Can't get product. Stop paging")
        })
    }

    render() {
//        console.log("Shop Products", this.props)
        return (
            <div>
                {!this.state.ready ?
                    (
                        <h2></h2>
                    )
                : (
                    <div>
                        <h1>{this.state.name}</h1>
                        <h5>{this.state.description}</h5>
                        <table className="pure-table pure-table-horizontal" width="100%">
                            <thead>
                                {this.state.isOwner ?
                                    <ProductTableHeaderManage /> :
                                    <ProductTableHeader />
                                }
                            </thead>
                            <tbody>
                                {this.state.list.map((row, i) => this.state.isOwner ?
                                    <ProductRowManage
                                        {...row}
                                        address={this.state.address}
                                        index={i}
                                    />:
                                    <ProductRow {...row} index={i} />
                                )}
                            </tbody>
                        </table>
                        <br />
                        {!this.state.stopPaging &&
                            <div>
                                <center><button className=" pure-button" onClick={this.handleShowMoreClick}>Show more</button></center>
                            </div>
                        }
                    </div>
                )}
            </div>
        );
    }
}

export default withAlert(ShopProducts)
