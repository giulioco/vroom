import React from 'react';
import { withRouter } from 'react-router-dom';


const getMessage = (code) => {
  switch (code) {
    case 'permission-denied':
    case 403: return [403, 'You don\'t have access to this content!'];
    case 404: return [404, 'Oops, nothing here!'];
    default: return [500, 'Something unexpected occurred... Please try again'];
  }
};

class ErrorBoundary extends React.Component {

  state = {
    code: 0,
    message: '',
    hasError: false,
  }

  componentDidCatch(error) {
    let message,
        code = 500;
    
    if (typeof error === 'string') message = error;
    else {
      if (error && error.code) code = error.code;
      else if (error && error.status) code = error.status;
      [code, message] = getMessage(code);
    }

    this.setState({
      hasError: true,
      code,
      message,
    });

    const unlisten = this.props.history.listen(() => {
      this.setState({ hasError: false });
      unlisten();
    });
  }

  goBack = () => {
    // TODO: Somehow check if error is a result of navigating
    // this.props.history.goBack();
    this.props.history.push('/');

    this.setState({
      hasError: false,
    });
  }

  render() {
    const { hasError, code, message } = this.state;

    return !hasError ? this.props.children : (
      <section className="hero is-fullheight-flex">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="is-size-1">{code}</h1>
            <h3 className="is-size-4">{message}</h3>
            <br/>
            <br/>
            <button className="button is-medium is-primary"
              onClick={this.goBack}>Go Back
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default withRouter(ErrorBoundary);
