'use strict'

class PolygonObsticle {
    constructor(path_points, color=0x0000FF) {
		this.graphics = new PIXI.Graphics();
		this.graphics.beginFill(color, 1);
		this.graphics.drawPolygon(path_points);
		this.graphics.endFill();
    }
}
