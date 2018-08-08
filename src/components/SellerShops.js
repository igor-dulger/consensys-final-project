import React, { Component } from 'react'
import marketplaceService from '../services/Marketplace'
import SellerShopRow from './SellerShopRow'
import { withAlert } from 'react-alert'

class SellerShops extends Component {
    constructor(props) {
        super(props)

        this.state = {
            list: [],
            account: this.props.account
        }

        this.getDeleteClickHandler = this.getDeleteClickHandler.bind(this);
        this.handleCreateClick = this.handleCreateClick.bind(this);
    }

    componentWillMount() {
        this.readState()
    }

    readState(account) {
        this.setState({
            list: [],
            account: (account) ? account : this.state.account
        })
        this.getNext(0);
    }

    getNext(id) {
        marketplaceService.getSellersNext(id).then(result => {
            //console.log(result)
            const row = {
                id: result[0].toString(),
                key: result[0].toString(),
                name: result[1],
                description: result[2],
                address: result[3],
                owner:  result[4],
                onDeleteClick: this.getDeleteClickHandler(result[0].toString())
            }
            this.getNext(row.id)
            let shops = this.state.list
            shops.push(row)
            this.setState({
                list: shops
            })
        }).catch((error) => {
            console.log("Can't get shop.")
        })
    }

    handleCreateClick(event) {
        window.location.replace("/shops/add")
    }

    getDeleteClickHandler(id) {
        return (event) => {
            this.props.alert.info('Deleting is in progress pls wait')
            marketplaceService.deleteShop(id).then(result => {
                this.readState()
                console.log(result)
            }).catch((error) => {
                console.log("Error can't delete shop.", error)
            })
            console.log("Click on delete", id, this)
        }
    }

    render() {
        if (this.props.account != this.state.account) {
            this.readState(this.props.account)
        }
//        console.log("Render seller shops", this.props)
        return (
            <div>
                <h1>{this.props.account} shops</h1>
                <button className="button-success pure-button" onClick={this.handleCreateClick}>Create Shop</button>
                <div>&nbsp;</div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Manage</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.list.map(row => <SellerShopRow {...row}/>)}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withAlert(SellerShops)
