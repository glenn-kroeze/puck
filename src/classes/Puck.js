import Entity from './Entity';
import {vAdd, vScale, vSub, vMag, vNorm, vDot} from 'vec-la-fp';

export default class Puck extends Entity {

  //In beide cases (wall of puck) kijken we of er in de volgende frame
  //een botsing heeft plaatsgevonden, zodat we kunnen ingrijpen voordat
  //beide objecten dezelfde ruimte innemen
  willCollideWith = entity => {
    const type = entity.constructor.name;
    if (type === 'Wall') {
      const [x1, y1] = vAdd(this.pos, this.velocity);
      const myWidth = this.radius * 2;
      const myHeight = this.radius * 2;
      const [x2, y2] = entity.pos;
      const [eWidth, eHeight] = entity.size;
      //Standaard 4-liner voor het bepalen van entity collision tussen 2 rechthoeken
      return x1 < x2 + eWidth &&
        x1 + myWidth > x2 &&
        y1 < y2 + eHeight &&
        myHeight + y1 > y2;
    }

    if (type === 'Puck') {
      const [x1, y1] = vAdd(this.pos, this.velocity);
      const [x2, y2] = vAdd(entity.pos, entity.velocity);
      //Stelling van pythagoras voor het bepalen van de lengte van de vector
      //tussen de 2 pucks
      const deltaX = Math.abs(x1 - x2);
      const deltaY = Math.abs(y1 - y2);
      const distance = Math.sqrt(
        Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
      );
      return distance < this.radius + entity.radius;
    }
  }

  //verticale velocity flippen wanneer een puck tegen een horizontaal staande
  //muur aan botst en vice versa
  bounceOffWall = wall => {
    const force = this.mass * vMag(this.velocity);
    const forceVector = vScale(force, vNorm(this.velocity));
    this.applyForce(vScale(-1, forceVector));
    if (wall.orientation === 'horizontal') {
      this.applyForce(vScale(0.9, [forceVector[0], -forceVector[1]]));
    } else {
      this.applyForce(vScale(0.9, [-forceVector[0], forceVector[1]]));
    }
  }

  bounceOffPuck = puck => {
    //Vector tussen de 2 pucks bepalen
    const vecToOtherPuck = vSub(puck.pos, this.pos);
    //Deze vector normaliseren, zodat we de richting van de botsing hebben
    const normalizedVecToOtherPuck = vNorm(vecToOtherPuck);

    const myOldVelocity = this.velocity;
    const otherOldVelocity = puck.velocity;

    //Deze implementatie werkte erg slecht bij kleine krachten
    // const f1 = 0.5 * this.mass * vDot(myOldVelocity, myOldVelocity);
    // const f2 = 0.5 * puck.mass * vDot(otherOldVelocity, otherOldVelocity);

    this.applyForce(vScale(-f1, vMag(myOldVelocity) === 0 ? [0, 0] : vNorm(myOldVelocity)));
    puck.applyForce(vScale(-f2, vMag(otherOldVelocity) === 0 ? [0, 0] : vNorm(otherOldVelocity)));

    // this.applyForce(vScale(-f2, normalizedVecToOtherPuck));
    // puck.applyForce(vScale(f1, normalizedVecToOtherPuck));

    //We scalen de genormaliseerde botsingsrichtingvector met de lengte van
    //de velocityvector van de andere puck. Dit doen we voor beide pucks.
    //De som van velocities van beide pucks is hierna onveranderd. Volgens:
    //v2,na = v1, voor en v1,na = v2,voor
    this.velocity = vScale(-vMag(otherOldVelocity), normalizedVecToOtherPuck);
    puck.velocity = vScale(vMag(myOldVelocity), normalizedVecToOtherPuck);
  }

  render = ctx => {
    if (this.visible) {
      //Nieuwe positie is de huidige positie plus de velocity
      this.pos = vAdd(this.pos, this.velocity);

      ctx.beginPath();
      ctx.fillStyle = this.color;
      //Dit ziet er een beetje raar uit, het moet maar even zo omdat canvas arcs
      //vanuit het middelpunt van de cirkel tekent, in plaats van linksboven tm rechtsonder,
      //zoals alle andere canvas functies.
      ctx.arc(...vAdd(this.pos, [this.radius, this.radius]), this.radius, 0, 2 * Math.PI);
      ctx.fill();

      //Pijltje tekenen in de richting van de velocity
      ctx.strokeStyle = 'red';
      ctx.moveTo(...this.pos.map(x => x + 25));
      ctx.lineTo(...this.pos.map((x, i) => x + 25 + (this.velocity[i] * 25)));
      ctx.stroke();
    }
  }
}
