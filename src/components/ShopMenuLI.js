import React, { Component } from 'react'
import { Link } from "react-router-dom";
class ShopMenuLI extends Component {
    render() {
        if (!this.props.show) {
            return null
        }
        const className = (this.props.current === this.props.url)
        ?
        "pure-menu-item pure-menu-selected"
        :
        "pure-menu-item"

        return (
                <li className={className}>
                    <Link to={this.props.url} className="pure-menu-link">{this.props.label}</Link>
                </li>
        );
    }
}

export default ShopMenuLI
