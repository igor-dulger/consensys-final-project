import React, { Component } from 'react'
import shopService from '../services/Shop'
import dataProvider from '../services/DataProvider'
import { withAlert } from 'react-alert'
import Loader from 'react-loader-spinner'
import Helpers from '../utils/Helpers'

class ManageProduct extends Component {
    constructor(props) {
        super(props)

        this.state = {
            address: props.address,
            id: '',
            name: '',
            price: '',
            quantity: '',
            image: '',
            submitDisabled: "",
            imageLoader: false,
            enableWatcher: false
        }

        this.events = {}

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handlePictureChange = this.handlePictureChange.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        if (this.props.mode === 'edit') {
            this.getProduct(this.props.match.params.id)
        }
        this.addWatchers(this.props.match.params.id)
    }
    componentWillUnmount() {
        Helpers.stopWatchers(this.events)
    }

    addWatchers() {
        this.events.productAdded = shopService.getWatcherProductAdded()
        this.events.productAdded.watch( (err, result) => {
            if (this.state.enableWatcher) {
                this.setState({
                    name: '',
                    price: '',
                    quantity: '',
                    image: '',
                    enableWatcher: false
                })
                this.props.alert.success("Product was created")
            }
        })
        this.events.productEdited = shopService.getWatcherProductEdited()
        this.events.productEdited.watch( (err, result) => {
            if (this.state.enableWatcher) {
                this.setState({
                    enableWatcher: false
                })
                this.props.alert.success("Product was updated")
            }
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
            this.setState({stopPaging: true})
            console.log("Can't get product.")
        })
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handlePriceChange(event) {
        this.setState({price: event.target.value});
    }

    handleQuantityChange(event) {
        this.setState({quantity: event.target.value});
    }

    handlePictureChange(event) {
        this.setState({
            submitDisabled: "disabled",
            imageLoader: true
        });
        const file = event.target.files[0]
        this.getIpfsHash(file).then((ipfsHash) => {
            this.setState({
                image: ipfsHash,
                submitDisabled: "",
                imageLoader: false
            })
        }).catch((error) => {
            console.log(error)
            this.props.alert.error("Error can't get ipfs hash")
        });
    }

    getIpfsHash (file) {
        return new Promise((resolve, reject) => {
            this.props.alert.info("Please wait image uploading can take some time")
            let reader = new window.FileReader()
            reader.onloadend = () => {
                let ipfsId
                const buffer = Buffer.from(reader.result)
                dataProvider.ipfsApi.add(
                    buffer,
                    { progress: (prog) => console.log(`received: ${prog}`) }
                ).then((response) => {
                    ipfsId = response[0].hash
                    console.log("ipfs", ipfsId)
                    resolve(ipfsId)
                }).catch((err) => {
                    reject(err)
                })
            }
            reader.readAsArrayBuffer(file)
        })
    }

    addProduct() {
        shopService.addProduct(
            this.state.name,
            dataProvider.web3.toWei(this.state.price, 'ether'),
            this.state.quantity,
            this.state.image
        ).then((result)=>{
            console.log(result)
            this.setState({enableWatcher: true})
            this.props.alert.info("Waiting for confirmation")
        }).catch((error) => {
            console.log(error)
            this.props.alert.error("Error can't create product")
        });
    }

    editProduct() {
        shopService.editProduct(
            this.state.id,
            this.state.name,
            dataProvider.web3.toWei(this.state.price, 'ether'),
            this.state.quantity,
            this.state.image
        ).then((result)=>{
            console.log(result)
            this.setState({enableWatcher: true})
            this.props.alert.info("Waiting for confirmation")
        }).catch((error) => {
            console.log(error)
            this.props.alert.error("Error can't update product")
        });
    }

    handleSubmit(event) {
        event.stopPropagation()
        event.preventDefault()
        if (this.props.mode === 'add') {
            this.addProduct()
        } else {
            this.editProduct()
        }
    }

    render() {
        var imageUrl = dataProvider.ipfsUrl + this.state.image
        var header = this.props.mode === 'add' ? "Create product" : "Update product"
        var button = this.props.mode === 'add' ? "Create" : "Update"

        return (
            <div>

                <h1>{header}</h1>

                <form className="pure-form pure-form-aligned" onSubmit={this.handleCheckSubmit}>
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="name">Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                className="pure-input-1-3"
                                value={this.state.name}
                                onChange={this.handleNameChange}
                            />
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="name">Price *</label>
                            <input
                                type="text"
                                name="price"
                                placeholder="Price"
                                className="pure-input-1-3"
                                value={this.state.price}
                                onChange={this.handlePriceChange}
                            /> Ether
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="name">Quantity *</label>
                            <input
                                type="text"
                                name="quantity"
                                placeholder="Quantity"
                                className="pure-input-1-3"
                                value={this.state.quantity}
                                onChange={this.handleQuantityChange}
                            />
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="name">Image *</label>
                            <input
                                type="file"
                                name="picture"
                                placeholder="picture"
                                className="pure-input-1-3"
                                onChange={this.handlePictureChange}
                            />
                            <span className="pure-form-message-inline">
                                {this.state.imageLoader ?
                                    (<Loader type="ThreeDots" color="#00BFFF" height="20" width="50" /> ) :
                                    this.state.image &&
                                    <img src={imageUrl} alt="product" />
                                }
                            </span>
                        </div>
                        <div className="pure-controls">
                            <button
                                type="submit"
                                disabled={this.state.submitDisabled}
                                className="pure-button pure-button-primary"
                                onClick={this.handleSubmit}
                            >
                                {button}
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}

export default withAlert(ManageProduct)
