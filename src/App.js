import logo from './logo.svg';
// import './App.css';
import './styles.css';
import Home from "./views/home/home";
import React, { Component } from "react";
import home from "./views/home/home";
import login from "./views/authentication/login"
import Admin from "./views/admin/admin"
import {BrowserRouter as Router, HashRouter, Switch, Route, Link, Redirect,useParams} from "react-router-dom";
import {auth} from './api/firebase';


export default class App extends Component {
    constructor() {
        super();
        this.state = {
            authenticated: false,
            loading: true,
        };
    }

    componentDidMount() {
        auth().onAuthStateChanged(user => {
            if (user) {
                console.log(user)
                this.setState({
                    authenticated: true,
                    loading: false
                });
            } else {
                this.setState({
                    authenticated: false,
                    loading: false
                });
            }
        });
        console.log(this.state.authenticated)
    }


    render() {
        return (
            <div style={{backgroundColor: '#000000', minHeight: '100vh',}} >
                <Router>
                    <Switch>
                        <Route exact path="/" component={home}/>

                        <PrivateRoute
                            path="/admin"
                            authenticated={this.state.authenticated}
                            component={Admin}
                        />

                        <PublicRoute
                            path="/login"
                            authenticated={this.state.authenticated}
                            component={login}
                        />
                    </Switch>
                </Router>

            </div>

        );
    }
}

function PrivateRoute({ component: Component, authenticated, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => authenticated === true
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
        />
    )
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
    return (
        <Route
            {...rest}
            render={props =>
                authenticated === false ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/admin"/>
                )
            }
        />
    );

}
