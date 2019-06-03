import React, { Component } from 'react';
import Canvas from './Canvas';
import Controls from './Controls';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      effect: null
    };
  }

  handleAction = effect => this.setState({ effect })

  componentDidUpdate() {
    this.state.effect && this.setState({ effect: null });
  }

  render() {
    const { effect } = this.state;
    return (
      <div>
        <Canvas effect={effect} />
        <Controls onAction={this.handleAction} />
        <div>
          1. Place puck
          2. Choose Force scalar value
          3. Launch in desired direction
        </div>
      </div>
    );
  }
}
