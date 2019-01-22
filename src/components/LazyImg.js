import React from 'react';


export default class LazyImg extends React.Component {

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
