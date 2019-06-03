import {vScale, vAdd} from 'vec-la-fp';

export default class Entity {
  constructor(config) {
    Object.entries(config).forEach(([key, val]) => this[key] = val);
    this.velocity = [0, 0];
  }

  applyForce = force => {
    // F = m * a dus a = F / m
    const acceleration = vScale(1 / this.mass, force);
    this.velocity = vAdd(this.velocity, acceleration);
  }

  resetVelocity = () => this.velocity = [0, 0]
}
