import React from 'react';
import { matchPath } from 'react-router-dom';


export const Spinner = ({ fullPage }) => (
  <div className={fullPage ? 'full-page' : ''}>
    <div className="spinner">
      <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle className="length" fill="none" strokeWidth="8" strokeLinecap="round" cx="33" cy="33" r="28"/>
      </svg>
      <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle fill="none" strokeWidth="8" strokeLinecap="round" cx="33" cy="33" r="28"/>
      </svg>
      <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle fill="none" strokeWidth="8" strokeLinecap="round" cx="33" cy="33" r="28"/>
      </svg>
      <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle fill="none" strokeWidth="8" strokeLinecap="round" cx="33" cy="33" r="28"/>
      </svg>
    </div>
  </div>
);

export class LazyImg extends React.PureComponent {

  state = {
    loaded: '',
    src: '',
  }

  componentDidMount() {
    if (this.props.src) this.loadImage();
  }

  componentDidUpdate(prevProps) {
    if (this.props.src !== prevProps.src) {
      if (this.props.src)
        this.loadImage(true);
      else
        this.setState({ src: '', loaded: '' });
    }
  }

  loadImage(forceAnimate) {
    this.$img = document.createElement('img');
    this.$img.src = this.props.src;
    if (this.$img.complete) {
      this.$img.remove();
      this.setState({ loaded: forceAnimate ? 'loaded' : 'preloaded', src: this.props.src });
    } else {
      this.$img.onload = this.onLoad;
      this.$img.onerror = this.onError;
    }
  }

  onLoad = () => {
    this.$img.remove();
    this.setState({ loaded: 'loaded', src: this.props.src });
  }

  onError = () => {
    this.$img.remove();
    this.setState({ loaded: 'failed' });
  }

  render() {
    const { children = null, style = {}, className = '', placeholder = null } = this.props;
    const { loaded, src } = this.state;

    return (
      <figure style={style} className={`image ${className}`}>
        <div className={`lazy ${loaded}`} style={{ backgroundImage: `url('${src}')` }}/>
        {loaded ? null : placeholder}
        {children}
      </figure>
    );
  }
}

// Similar to react-router Switch component, but keeps routes
// rendered in background after they have been visited
const UNVISITED = 0;
const VISITED = 1;
const CURRENT = 2;
export class LiveSwitch extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.updateRoutes(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.setState(this.updateRoutes(nextProps));
    }
  }

  updateRoutes = ({ routes, match: prevMatch, location }) => {

    let routeFound = false;
    
    const routeStates = routes.map(({ path, exact, strict, sensitive }, i) => {
      const match = !routeFound && matchPath(
        location.pathname,
        { path, exact, strict, sensitive },
        prevMatch,
      );

      if (match) {
        routeFound = true;
        return CURRENT;
      } else if (this.state && this.state.routeStates[i] !== UNVISITED) return VISITED;
      else return UNVISITED;

    });

    return {
      routeStates,
      routeFound,
    };
  }

  render() {
    const { routeStates, routeFound } = this.state;

    if (!routeFound) throw { code: 404 };

    return this.props.routes.map(({ element }, i) => {
      const status = routeStates[i];
      const style = status !== CURRENT ? { display: 'none' } : {};

      return status !== UNVISITED ? <div key={i} style={style}>{element}</div> : null;
    });
  }
}
