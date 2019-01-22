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

// Main pages:
import Home from './Home';
import About from './About';
import Dashboard from './Dashboard';
import Account from './Account';
import Setup from './Setup' ;
import Listings from './Listings';
import CreateListing from './CreateListing';
// import ViewListing from './ViewListing';
import ErrorBoundary from './ErrorBoundary';
import Nav from './Nav';
import * as db from '../db';


// Set default NavLink activeClassName
NavLink.defaultProps.activeClassName = 'is-active';


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => db.getUser() ? <Component {...props} /> : <Redirect to={{
    pathname: '/',
    search: `?from=${encodeURIComponent(props.location.pathname)}`,
  }} />}/>
);


const App = () => (
  <Router>
    {/* <RouterToUrlQuery> */}
    <>
      <Nav />
      <ErrorBoundary>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <PrivateRoute exact path="/setup" component={Setup} />
          <PrivateRoute exact path="/account" component={Account} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/listings/new" component={CreateListing} />
          {/* <PrivateRoute exact path="/listings/:id" component={ViewListing} /> */}
          <PrivateRoute path="/listings" component={Listings} />
          <Route exact path="/logout" render={() => {
            db.signOut().catch(console.error);
            return <Redirect to="/" />;
          }} />
          <Route render={() => { throw { code: 404 }; }} />
        </Switch>
      </ErrorBoundary>
      <Route render={({ history }) => {
        // Auto-update service worker on route change
        history.listen(() => {
          if (window.swUpdate === true) window.location.reload();
        });
        return null;
      }} />
    </>
    {/* </RouterToUrlQuery> */}
  </Router>
);

export default hot(module)(App);
