import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import getWeb3 from './utils/getWeb3'
import getAccounts from './utils/getAccounts'
import dataProvider from './services/DataProvider'
import marketplaceService from './services/Marketplace'

import Shops from './components/Shops'
import AdminManagement from './components/AdminManagement'
import SellerManagement from './components/SellerManagement'
import SellerShops from './components/SellerShops'
import CreateShop from './components/CreateShop'
import ShopRouter from './components/ShopRouter'

import { withAlert } from 'react-alert'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './css/components/App.css'

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ready: false,
            roles: {
                owner: false,
                admin: false,
                seller: false
            },
            account: null
        }
        this.watchAccountChangeDescriptor = null
    }

    watchAccountChange() {
        var accountInterval = setInterval(() => {
            if (dataProvider.web3.eth.accounts[0] !== dataProvider.account) {
                location.reload()
            }
        }, 100);
        return accountInterval
    }

    getRoles() {
        marketplaceService.getRoles().then((roles) => {
            console.log("Get roles", roles)
            return this.setState({
                roles: roles
            });
        })
    }

    componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
        getWeb3.then(results => {
            dataProvider.set({web3: results.web3})
        // Instantiate contract once web3 provided.
            this.instantiateContract()
        }).catch(() => {
            console.log('Error finding web3.')
        })
    }

    instantiateContract() {
        console.log("Get marketplace contract")
        getAccounts().then((accounts) => {
            marketplaceService.getContract().then((contract) => {
                console.log("Account ", accounts[0], "marketplace ", contract)
                dataProvider.set({
                    account: accounts[0],
                    marketplace: contract
                })
                this.getRoles()
                this.watchAccountChangeDescriptor = this.watchAccountChange()
                this.setState({
                    ready: true,
                    account: dataProvider.account
                })
            })
        })
    }


    render() {
        console.log("App render", this.props, this.state)

        // const NoMatch = ({ location }) => (
        //   <div>
        //       <h1>
        //           QQQQQQQQQQQQQQQQQQQQQQQQqq Page not found 404 QQQQQQQQQQQQQQQQQQQQQQQQQQQQ
        //       </h1>
        //   </div>
        // )

        return (
            <Router>
                <div className="App">
                    <nav className="navbar pure-menu pure-menu-horizontal">
                        <Link to="/" className="pure-menu-heading pure-menu-link">Home</Link>
                        {this.state.roles.owner &&
                            <Link to="/admins" className="pure-menu-heading pure-menu-link">Admin management</Link>
                        }
                        {(this.state.roles.owner || this.state.roles.admin) &&
                            <Link to="/sellers" className="pure-menu-heading pure-menu-link">Seller management</Link>
                        }
                        {this.state.roles.seller &&
                            <Link to="/shops" className="pure-menu-heading pure-menu-link">Shops management</Link>
                        }
                    </nav>
                    <main className="container">
                        <div className="pure-g">
                            <div className="pure-u-1-5"></div>
                            <div className="pure-u-3-5">
                                {!this.state.ready ?
                                    (
                                        <h2></h2>
                                    )
                                : (
                                    <Switch>
                                        <Route exact path='/' render={(props) => (
                                            <Shops roles={this.state.roles}/>
                                        )}/>
                                        {this.state.roles.owner &&
                                            <Route exact path='/admins' render={(props) => (
                                                <AdminManagement {...props} roles={this.state.roles}/>
                                            )}/>
                                        }
                                        {(this.state.roles.owner || this.state.roles.admin) &&
                                            <Route path="/sellers" component={SellerManagement}/>
                                        }
                                        {this.state.roles.seller &&
                                            <Route path="/shops/add" component={CreateShop}/>
                                        }
                                        {this.state.roles.seller &&
                                            <Route path="/shops" render={(props) => (
                                                <SellerShops {...props} account={this.state.account} />
                                            )}/>
                                        }
                                        <Route path="/shop/:address" render={(props) => (
                                            <ShopRouter {...props} />
                                        )}/>
                                    </Switch>
                                )}
                            </div>
                            <div className="pure-u-1-5"></div>
                        </div>
                    </main>
                </div>
            </Router>
        );
    }
}

export default withAlert(App)
