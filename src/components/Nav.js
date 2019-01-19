import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';

import * as db from '../db';


// To support a fixed header, add this class to document head
// document.documentElement.classList.add('has-navbar-fixed-top');

class Nav extends React.PureComponent {

  state = {
    open: false,
    loggedIn: !!db.getUser(),
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location)
      this.setState({
        open: false,
        loggedIn: !!db.getUser(), // HACK to check if loggedIn state changes
      });
  }

  toggle = () => this.setState(({ open }) => ({ open: !open }))

  signIn = () => db.signIn()
  .then((path) => this.props.history.push(path))
  .catch(console.error);

  render() {
    const { open, loggedIn } = this.state;

    const username = db.getUser() && db.getUser().displayName;

    return (
      <nav className="navbar is-transparent">
        <div className="container">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/">
              <h1 className="is-size-4 site-title">Vroom</h1>
            </Link>
            <div className={`navbar-burger burger ${open ? 'is-active' : ''}`}
              onClick={this.toggle} role="button" tabIndex="0">
              <span/>
              <span/>
              <span/>
            </div>
          </div>
          <div className={`navbar-menu ${open ? 'is-active' : ''}`}>
            <div className="navbar-start">
              <NavLink className="navbar-item" to="/about">
                About
              </NavLink>
            </div>
            <div className="navbar-end">
              { loggedIn ? <>
                <div className="navbar-item has-dropdown is-hoverable">
                  <NavLink className="navbar-link" to="/account">
                    {username}
                  </NavLink>
                  <div className="navbar-dropdown is-right is-boxed">
                    <Link className="navbar-item" to="/account">
                      Account
                    </Link>
                    <hr className="navbar-divider"/>
                    <Link className="navbar-item" to="/logout">
                      Logout
                    </Link>
                  </div>
                </div>
              </> : <>
                <a className="navbar-item">
                  <button onClick={this.signIn} className="button">Sign In</button>
                </a>
                <a className="navbar-item">
                  <button onClick={this.signUp} className="button">Sign Up</button>
                </a>
              </>}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(Nav);
