define(
  [
      'jquery'
    ,'../fluid-simulation-engine/base/World'
    ,'../fluid-simulation-engine/base/Particle'
    ,'../fluid-simulation-engine/base/WaterParticle'
    ,'../fluid-simulation-engine/geometry/Vector'
    ,'./addBodies'
  ], function ($, World, Particle, WaterParticle, Vector, addBodies) {
	return function () {
    var world = new World();
    addBodies(world);
    world.addParticlesGrid(25, 40, 130, 990, WaterParticle);  //rows, cols, x, y, type

    (function (world) {
      var minPoint = world.getBodiesMinPoint();
      var maxPoint = world.getBodiesMaxPoint();
      world.setOutOfBoundsBehaviour(new Vector(650, 200), function (particle) {
        if(particle.coords.y > maxPoint.y || particle.coords.y < minPoint.y || particle.coords.x > maxPoint.x || particle.coords.x < minPoint.x)
          return true;
        else
          return false;
      });
    })(world);

    return world;
  }
});
