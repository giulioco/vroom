import React, { Component } from 'react';

import * as db from '../db';
import { Spinner } from './misc';


// const MATCH_CHAT_ID = /^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})_(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$/;

export default class Messenger extends Component {

  state = {
    messages: null,
    message: '',
    sending: false,
    error: null,
    users: {},
  }

  componentWillMount() {

    this.chatId = this.props.match.params.id;

    // const match = this.chatId.match(MATCH_CHAT_ID);
    // if (!match) throw { code: 400 };

    this.userId = db.getUser().uid;
    this.chatRef = db.chat.doc(this.chatId);
    this.messagesRef = this.chatRef.collection('messages');

    this.chatRef.get().then((doc) => {
      if (!doc.exists) {
        this.setState({ error: 404 });
        return;
      }

      const data = doc.data();
      const otherUser = Object.keys(data.users).filter(u => u !== this.userId)[0];
      db.users.doc(otherUser).get().then((doc2) => {
        this.setState({
          users: {
            [otherUser]: doc2.data(),
            [this.userId]: db.userData(),
          },
        });
      });

      this.unsubscribe = this.messagesRef.orderBy('created', 'desc').limit(30).onSnapshot((snap) => {
        // TODO use snap.docChanges()
  
        // Display messages in reverse order (newest at the bottom)
        const messages = [];
        for (const doc2 of snap.docs) {
          const data2 = doc2.data();
          data2.id = doc2.id;
          messages.unshift(data2);
        }
  
        this.setState({ messages });
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  renderMessage = ({ id, text, created, user_id }) => {
    const me = user_id === this.userId;
    const time = created.toDate().toLocaleString();
    let name;
    if (me) name = 'Me';
    else {
      const user = this.state.users[user_id];
      name = (user && user.name) || '...';
    }
    return (
      <div key={id} className={`messenger-message ${me ? 'mine' : ''}`}>
        <p>{text}</p>
        <p className="has-text-grey is-size-7">{time} - {name}</p>
      </div>
    );
  }

  sendMessage = (e) => {
    e.preventDefault();

    const text = this.state.message;
    this.setState({ sending: true, message: '' }, () => {
      this.messagesRef.add({
        text,
        created: db.Helpers.Timestamp.now(),
        user_id: this.userId,
      })
      .then(() => this.setState({ sending: false }))
      .catch(() => this.setState({ sending: false, error: 'Failed to send message' }));
    });
  }

  onType = (e) => {
    this.setState({ message: e.target.value });
  }

  render() {
    const { messages, message, sending, error, users } = this.state;

    if (typeof error === 'number') throw { code: error };

    const otherUsers = [];
    for (const id in users) {
      if (id !== this.userId) otherUsers.push(users[id].name);
    }

    return (
      <div className="messenger container">
        <h3 className="is-size-3">Chatting with {otherUsers.length ? otherUsers.join(', ') : '...'}</h3>
        <div className="messenger-body">
          { messages ? messages.map(this.renderMessage) : <Spinner fullPage/>}
        </div>
        <form onSubmit={this.sendMessage}>
          { error && (<p className="is-danger">{error}</p>)}
          <div className="field has-addons">
            <div className="control is-expanded">
              <input className="input is-info is-rounded" type="text"
                placeholder="Type a message" value={message} onChange={this.onType}/>
            </div>
            <div className="control">
              <button type="submit" className={`button is-rounded is-info ${sending ? 'is-loading' : ''}`}
                disabled={!message || sending || !messages}>
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
