import React from 'react';


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
    if (this.props.src !== prevProps.src && this.props.src) {
      this.loadImage(true);
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
    }
  }

  onLoad = () => {
    this.$img.remove();
    this.setState({ loaded: 'loaded', src: this.props.src });
  }

  render() {
    const { children = null, style = {}, className = '', placeholder = '' } = this.props;
    const { loaded, src } = this.state;

    return (
      <div style={{ background: placeholder, ...style }} className={className}>
        <div className={`lazy ${loaded}`} style={{ backgroundImage: `url('${src}')` }}/>
        {children}
      </div>
    );
  }
}
