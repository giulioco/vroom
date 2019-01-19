import React from 'react';
import { hot } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';
// import RouterToUrlQuery from 'react-url-query/lib/react/RouterToUrlQuery';

import Home from './Home';
import About from './About';
import ErrorBoundary from './ErrorBoundary';
import Account from './Account';
import Nav from './Nav';

import * as db from '../db';


// Set default NavLink activeClassName
NavLink.defaultProps.activeClassName = 'is-active';


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => db.getUser() ? <Component {...props}/> : (
    <Redirect to={{
      pathname: '/',
      search: `?from=${encodeURIComponent(props.location.pathname)}`,
    }}/>
  )}/>
);


const App = () => (
  <Router>
    {/* <RouterToUrlQuery> */}
      <>
        <Nav/>
        <ErrorBoundary>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/about" component={About}/>
            <PrivateRoute exact path="/account" component={Account}/>
            <Route exact path="/logout" render={() => {
              db.signOut().catch(console.error);
              return <Redirect to="/"/>;
            }}/>
            <Route render={() => { throw { code: 404 }; }}/>
          </Switch>
        </ErrorBoundary>
        <Route render={({ history }) => {
          // Auto-update service worker on route change
          history.listen(() => {
            if (window.swUpdate === true) window.location.reload();
          });
          return null;
        }}/>
      </>
    {/* </RouterToUrlQuery> */}
  </Router>
);

export default hot(module)(App);
