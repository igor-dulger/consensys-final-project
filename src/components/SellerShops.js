import React, { Component } from 'react'
import marketplaceService from '../services/Marketplace'
import SellerShopRow from './SellerShopRow'
import { withAlert } from 'react-alert'

class SellerShops extends Component {
    constructor(props) {
        super(props)

        this.state = {
            list: [],
            account: this.props.account,
            pageSize: 10,
            readInProgress: false,
            lastDeleted: 0
        }

        this.getDeleteClickHandler = this.getDeleteClickHandler.bind(this);
        this.handleCreateClick = this.handleCreateClick.bind(this);
    }

    componentWillMount() {
        this.readState()
        this.addWatchers()
    }

    addWatchers() {
        marketplaceService.getWatcherShopDeleted().watch ((err, result) => {
            console.log("Watcher delete shop", result)
            if (this.state.lastDeleted === result.args.id.toString()) {
                this.props.alert.success("Shop was deleted")
            }
            this.readState()
        })
    }

    readState(account) {
        if (this.state.readInProgress) return
        this.setState({
            list: [],
            readInProgress: true,
            lastDeleted: 0,
            account: (account) ? account : this.state.account
        })
        this.getNext(0, 0);
    }

    getNext(id, showed) {
        if (showed >= this.state.pageSize) {
            this.setState({
                readInProgress: false
            })
            return
        }
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
            this.getNext(row.id, showed)
            let shops = this.state.list
            shops.push(row)
            this.setState({
                list: shops
            })
        }).catch((error) => {
            console.log("Can't get shop.")
            this.setState({
                readInProgress: false
            })
        })
    }

    handleCreateClick(event) {
        window.location.replace("/shops/add")
    }

    getDeleteClickHandler(id) {
        return (event) => {
            marketplaceService.deleteShop(id).then(result => {
                console.log(result)
                this.props.alert.info('Deleting is in progress pls wait')
                this.setState({lastDeleted: id})
            }).catch((error) => {
                console.log("Error can't delete shop.", error)
            })
        }
    }

    render() {
        if (this.props.account !== this.state.account) {
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
