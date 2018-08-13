import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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
                console.log(accounts[0], contract)
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
        const NoMatch = ({ location }) => (
          <div>
              <h1>
                  Page not found 404
              </h1>
          </div>
        )
        return (
            <div className="App">
                <nav className="navbar pure-menu pure-menu-horizontal">
                    <a href="/" className="pure-menu-heading pure-menu-link">Home</a>
                    {this.state.roles.owner &&
                        <a href="/admins" className="pure-menu-heading pure-menu-link">Admin management</a>
                    }
                    {(this.state.roles.owner || this.state.roles.admin) &&
                        <a href="sellers" className="pure-menu-heading pure-menu-link">Seller management</a>
                    }
                    {this.state.roles.seller &&
                        <a href="/shops" className="pure-menu-heading pure-menu-link">Shops management</a>
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
                                <Router>
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
                                        <Route component={NoMatch}/>
                                    </Switch>
                                </Router>
                            )}
                        </div>
                        <div className="pure-u-1-5"></div>
                    </div>
                </main>
            </div>
        );
    }
}

export default withAlert(App)
