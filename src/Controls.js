import React, {Component} from 'react';
import styles from './styles.scss';
import {vScale} from 'vec-la-fp';

//Conversie van graden naar radialen, aangezien Math.sin en Math.cos met radialen werken
const degToRad = deg => deg * Math.PI / 180;

//Neemt een hoek in graden en returnt een genormaliseerde vector langs deze hoek
const angleVector = angle => ([
  Math.cos(degToRad(angle)),
  -Math.sin(degToRad(angle))
]);

export default class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scalar: 1
    };
  }

  setScalar = e => this.setState({scalar: e.target.value})

  onAction = angle => this.props.onAction(vScale(this.state.scalar, angleVector(angle)))

  //8 richtingen in stappen van 45 graden, met in het midden een stopknop
  actionRows = [
    [
      () => this.onAction(135),
      () => this.onAction(90),
      () => this.onAction(45)
    ],
    [
      () => this.onAction(180),
      () => this.props.onAction('FREEZE'),
      () => this.onAction(0)
    ],
    [
      () => this.onAction(225),
      () => this.onAction(270),
      () => this.onAction(315)
    ]
  ]

  renderAction = func => <div className={styles.action} onClick={func} />

  renderActionRow = actionRow => (
    <div className={styles.actionRow}>
      {actionRow.map(this.renderAction)}
    </div>
  )

  render() {
    const {scalar} = this.state;
    return (
      <div className={styles.controls}>
        {this.actionRows.map(this.renderActionRow)}
        <input type="range" min={1} max={10} value={scalar} onChange={this.setScalar} />
        <div >{`Force scalar value: ${scalar}`}</div>
      </div>
    );
  }
}
