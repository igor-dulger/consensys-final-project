import React, { Component } from 'react'
import { Route, Switch } from "react-router-dom";

import dataProvider from '../services/DataProvider'
import shopService from '../services/Shop'

import BlankPage from '../components/BlankPage'
import ShopProducts from '../components/ShopProducts'
import ShowProduct from '../components/ShowProduct'
import ManageProduct from '../components/ManageProduct'
import Withdraw from '../components/Withdraw'
import ShopMenuLI from '../components/ShopMenuLI'
import ipfsAPI from 'ipfs-api'

import { withAlert } from 'react-alert'

class ShopRouter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ready: false,
            account: null,
            owner: '',
            isOwner: false
        }
    }

    componentWillMount() {
        this.instantiateContract(this.props.match.params.address)
        dataProvider.set({
            ipfsApi: ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https'})
        })
    }

    readOptions() {
        shopService.owner().then(result => {
            this.setState({
                owner: result,
                isOwner: result === dataProvider.account
            })
        }).catch((error) => {
            console.log("Can't get shop owner.")
        })
    }

    instantiateContract(address) {
        console.log("Get shop contract")
        shopService.getContract(address).then((contract) => {
            console.log("Shop contract", new Date(), contract)
            dataProvider.set({
                shop: contract
            })
            this.readOptions()

//            this.getRoles()
            this.setState({
                ready: true,
            })
        }).catch((error) => {
            console.log("Error can't load contract instance", error)
        })
    }

    render() {
        console.log("Shop app render", this.props, this.state)
        const address = this.props.match.params.address
        const isOwner = this.state.isOwner
        return (
            <div>
                {!this.state.ready ?
                    (
                        <h2></h2>
                    )
                : (
                    <div>
                        <div className="pure-menu pure-menu-horizontal pure-menu-scrollable">
                            <ul className="pure-menu-list">
                                <ShopMenuLI url={this.props.match.url} show="true" current={this.props.location.pathname} label="Home"/>
                                <ShopMenuLI url={`${this.props.match.url}/add`} show={isOwner} current={this.props.location.pathname} label="Create Product"/>
                                <ShopMenuLI url={`${this.props.match.url}/withdraw`}  show={isOwner} current={this.props.location.pathname} label="Withdraw"/>
                            </ul>
                        </div>

                        <Switch>
                            {this.state.isOwner &&
                                <Route exact path={`${this.props.match.url}/withdraw`} render={(props) => (
                                    <Withdraw {...props} address={address}/>
                                )}/>
                            }
                            {this.state.isOwner &&
                                <Route exact path={`${this.props.match.url}/add`} render={(props) => (
                                    <ManageProduct {...props} mode="add" address={address}/>
                                )}/>
                            }
                            {this.state.isOwner &&
                                <Route exact path={`${this.props.match.url}/edit/:id`} render={(props) => (
                                    <ManageProduct {...props} mode="edit" address={address}/>
                                )}/>
                            }
                            <Route path={`${this.props.match.url}/product/:id`} render={(props) => (
                                <ShowProduct {...props}  address={address}/>
                            )}/>
                            <Route exact path={`${this.props.match.url}/`} render={(props) => (
                                <ShopProducts {...props} address={address}/>
                            )}/>
                            <Route render={(props) => (
                                <BlankPage message="Page not found"/>
                            )}/>
                        </Switch>
                    </div>
                )}
            </div>

        );
    }
}

export default withAlert(ShopRouter)
