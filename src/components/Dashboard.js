import React from 'react';
import { Link, Route, Switch, matchPath } from 'react-router-dom';

import * as db from '../db';
import BookingEntry from './BookingEntry';
import { Spinner } from './misc';


const pages = [{
  id: '',
  name: 'Active Bookings',
  desc: 'the active ones',
  node: ({ active }) => active.map((entry) => <BookingEntry {...entry} key={entry.id}/>),
}, {
  id: 'requests',
  name: 'Booking Requests',
  desc: 'the requested ones',
  node: ({ requests }) => requests.map((entry) => <BookingEntry {...entry} key={entry.id}/>),
}, {
  id: 'past',
  name: 'Past Bookings',
  desc: 'the past ones',
  node: ({ past }) => past.map((entry) => <BookingEntry {...entry} key={entry.id}/>),
},
// {
//   id: 'listings',
//   name: 'My Listings',
//   desc: 'the listingssss',
//   node: ({ listings }) => listings.map((listing) => <div key={listing.id}>{listing.listing_name}</div>),
// }
];

const renderPage = (page, data) => {
  
  const items = page.node(data);

  return () => <>
    <p className="has-text-centered">{page.desc}</p>
    <br/>
    {items.length ? items : (
      <div className="box">
        <p className="is-size-4 has-text-link has-text-centered">Nothing here</p>
      </div>
    )}
  </>;
};


export default class Dashboard extends React.Component {

  state = {
    active: null,
    past: null,
    request: null,
    // listings: null,
    loading: true,
  }

  componentDidMount() {

    const userId = db.getUser().uid;

    this.unsubscribe1 = db.bookings.where('lister_id', '==', userId).orderBy('created', 'desc')
    .onSnapshot((snap) => {
      this.mine = snap.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      this.load();
    });

    this.unsubscribe2 = db.bookings.where('booker_id', '==', userId).orderBy('created', 'desc')
    .onSnapshot((snap) => {
      this.theirs = snap.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      this.load();
    });

    // this.unsubscribe3 = db.listings.where('lister_id', '==', userId).onSnapshot((snap) => {
    //   this.listings = snap.docs.map((doc) => {
    //     const data = doc.data();
    //     data.id = doc.id;
    //     return data;
    //   });
    //   this.load();
    // });
  }

  componentWillUnmount() {
    this.unsubscribe1();
    this.unsubscribe2();
    // this.unsubscribe3();
  }

  load() {
    // Wait for all collections to load
    if (!this.theirs || !this.mine) return;

    const active = [],
          past = [],
          requests = [];
    
    for (const entry of this.theirs) {
      if (entry.status === 'active') active.push(entry);
      else if (entry.status === 'pending') requests.push(entry);
      else past.push(entry);
    }
    for (const entry of this.mine) {
      if (entry.status === 'active') active.push(entry);
      else if (entry.status === 'pending') requests.push(entry);
      else past.push(entry);
    }

    this.setState({
      active,
      past,
      requests,
      // listings: this.listings,
      loading: false,
    });
  }

  render() {
    const { loading, ...data } = this.state;

    const match = matchPath(this.props.location.pathname, {
      path: '/dashboard/:path',
      exact: true,
      // strict: true,
    });
    const tabId = match ? match.params.path : '';

    return (
      <section className="section">
        <div className="container">
          <h1 className="is-size-1">Dashboard</h1>
          <br/>
          <div className="tabs is-centered is-toggle">
            <ul>
              {pages.map(({ id, name, icon }) => (
                <li className={id === tabId ? 'is-active' : ''} key={id}>
                  <Link to={`/dashboard/${id}`}>
                    { icon && (
                      <span className="icon is-small"><i className={`fas fa-${icon}`} aria-hidden="true"/></span>
                    )}
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          { loading ? <Spinner fullPage/> : (
            <Switch>
              {pages.map((page) => (
                <Route key={page.id} exact path={`/dashboard/${page.id}`} render={renderPage(page, data)}/>
              ))}
              <Route render={() => { throw { code: 404 }; }}/>
            </Switch>
          )}
        </div>
      </section>
    );
  }

}
