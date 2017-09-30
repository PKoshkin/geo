function Model() {
    var self = this;
    self.units = [];
    self.active_units = []; // Эти юниты получают новое направление движения при ЛКМ
    self.activating_rect_x_reflected = false;
    self.activating_rect_y_reflected = false;

    self.init_map = function() {
        model.map = new Map();
        var new_obstacle = new Obstacle([
            new PIXI.Point(100, 400),
            new PIXI.Point(150, 350),
            new PIXI.Point(200, 320),
            new PIXI.Point(250, 370),
            new PIXI.Point(300, 420),
            new PIXI.Point(200, 600)
        ]);
        model.map.obstacles.push(new_obstacle);
        model.draw_map();

        var unit_1 = new Unit(700, 100);
        unit_1.mass = 10
        unit_1.direction_force_module = 10;
        model.add_unit(unit_1);
        var unit_2 = new Unit(1000, 100);
        model.add_unit(unit_2);
        var unit_3 = new Unit(1300, 100);
        model.add_unit(unit_3);
        var unit_4 = new Unit(700, 300);
        model.add_unit(unit_4);
        var unit_5 = new Unit(1000, 300);
        model.add_unit(unit_5);
        var unit_6 = new Unit(1300, 300);
        model.add_unit(unit_6);
        var unit_7 = new Unit(700, 500);
        model.add_unit(unit_7);
        var unit_8 = new Unit(1000, 500);
        model.add_unit(unit_8);
        var unit_9 = new Unit(1300, 500);
        model.add_unit(unit_9);
    }

    self.draw_map = function() {
        for (var i = 0; i < model.map.obstacles.length; ++i) {
            application.stage.addChild(model.map.obstacles[i].graphics);
        }
    }

    self.add_unit = function(unit) {
        unit.redraw();
        controller.bind_unit(unit);
        application.stage.addChild(unit.graphics);
        model.units.push(unit);
    }

    self.set_active = function(unit, is_active) {
        unit.is_active = is_active;
        unit.redraw();
        controller.bind_unit(unit);
        application.stage.addChild(unit.graphics);
    }
}
