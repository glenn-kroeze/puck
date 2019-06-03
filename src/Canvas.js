import React, {Component} from 'react';
import {Puck, Wall} from './classes';

const walls = [
  new Wall({
    pos: [0, 0],
    size: [500, 50],
  }),
  new Wall({
    pos: [0, 450],
    size: [500, 50],
  }),
  new Wall({
    pos: [0, 50],
    size: [50, 400],
  }),
  new Wall({
    pos: [450, 50],
    size: [50, 450],
  })
];

const pucks = [
  new Puck({
    pos: [70, 80],
    radius: 25,
    mass: 0.5,
    color: 'navy',
    visible: false
  }),
  new Puck({
    pos: [300, 300],
    radius: 25,
    mass: 0.5,
    color: 'black',
    visible: true
  }),
];

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      puckPlaced: false,
      mouseX: 0,
      mouseY: 0
    };
  }

  updateMouse = ({clientX, clientY}) => this.setState({
    mouseX: clientX,
    mouseY: clientY
  })

  componentWillMount() {
    document.addEventListener('mousemove', this.updateMouse);
  }

  placePuck = () => {
    const {mouseX, mouseY} = this.state;
    pucks[0].pos = [mouseX, mouseY].map(x => x - 25);
    pucks[0].visible = true;
    this.setState({puckPlaced: true});
    document.removeEventListener('mousemove', this.updateMouse);
  }

  updateCanvas = () => {
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.rect(50, 50, 450, 450);
    ctx.fill();

    //De preview van de puck voordat hij geplaatst is
    if (!this.state.puckPlaced) {
      const {mouseX, mouseY} = this.state;
      ctx.beginPath();
      ctx.fillStyle = 'navy';
      ctx.arc(mouseX, mouseY, 25, 0, 2 * Math.PI);
      ctx.fill();
    }

    pucks.forEach((puck, i) => {
      const otherPuck = i === 1 ? pucks[0] : pucks[1];
      walls.forEach(wall => {
        if (puck.willCollideWith(wall)) {
          puck.bounceOffWall(wall);
        }
      });

      if (puck.willCollideWith(otherPuck)) {
        puck.bounceOffPuck(otherPuck);
      }
    });

    pucks.forEach(puck => puck.render(ctx));
    walls.forEach(wall => wall.render(ctx));
    requestAnimationFrame(this.updateCanvas);
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current.getContext('2d');
    this.updateCanvas();
  }

  componentDidUpdate() {
    if (this.props.effect) {
      if (this.props.effect === 'FREEZE') {
        pucks[0].resetVelocity();
      } else {
        pucks[0].applyForce(this.props.effect);
      }
    }
  }

  render() {
    return (
      <canvas ref={this.canvasRef} width={500} height={500} onClick={this.placePuck} />
    );
  }
}
