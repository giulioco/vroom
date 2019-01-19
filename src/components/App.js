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

import ErrorBoundary from './ErrorBoundary';
import Nav from './Nav';
import * as db from '../db';


// Set default NavLink activeClassName
NavLink.defaultProps.activeClassName = 'is-active';


const PrivateRoute = ({ component: Component, ...rest }) => {

  let redirect;
  if (db.userData && !db.userData.setup) redirect = <Redirect to={{
    pathname: '/setup',
  }}/>;
  else if (!db.getUser()) redirect = <Redirect to={{
    pathname: '/',
    search: `?from=${encodeURIComponent(props.location.pathname)}`,
  }}/>;

  return <Route {...rest} render={(props) => !redirect ? <Component {...props}/> : redirect}/>
};


const App = () => (
  <Router>
    {/* <RouterToUrlQuery> */}
      <>
        <Nav/>
        <ErrorBoundary>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/dashboard" component={Dashboard}/>
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
