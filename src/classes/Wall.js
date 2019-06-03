import Entity from './Entity';

export default class Wall extends Entity {
  constructor(config) {
    super(config);
    const [width, height] = this.size;
    this.orientation = width > height
      ? 'horizontal'
      : 'vertical';
  }

    render = ctx => {
      ctx.beginPath();
      ctx.fillStyle = 'grey';
      ctx.rect(...this.pos, ...this.size);
      ctx.fill();
    }
}
