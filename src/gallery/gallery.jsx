'use strict';

import React from "react";
import ReactDOM from "react-dom";

const e = React.createElement;

class MyGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      console.log(this.props.photoDir)
      return `You liked this. this.props.photoDir is ${this.props.photoDir}`;
    }

    return (
      <button onClick={() => this.setState({ liked: true })}>
        Like
      </button>
    );
  }
}

const domContainer = document.querySelector('#gallery_container');
console.log(domContainer.firstChild.data)
ReactDOM.render(<MyGallery photoDir={domContainer.firstChild.data}/>, domContainer);
