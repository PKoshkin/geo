'use strict'

class Map {
    constructor(stage) {
		this.stage = stage;

        this.obsticles = [];
        this.units = [];
        this.selected_units = [];
    }

	add_obsticle(obsticle) {
		this.stage.addChild(obsticle.graphics);
		this.obsticles.push(obsticle);
	}
}
