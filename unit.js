function Unit(in_x, in_y, in_radius=50) {
    var self = this;
    self.direction_point = new PIXI.Point(in_x, in_y);
    self.color = 0xFF0000;
    // Нужно чтобы не делать очень маленькие
    // и бесплезные осциллирующие шаги, если юнит уже и так близко к цели.
    self.epsilon = 2;
    self.velocity_epsilon = 0.2;
    self.is_active = false;
    self.mass = 1;
    self.velocity = new PIXI.Point(0, 0); // Скорость
    self.direction_force_module = 0.5; // Модуль скорости в сторону точки назначения
    self.resistance_coefficient = 0.1; // Коэффициент сопротивления

    self.get_position = function() {
        return self.graphics.position;
    }

    self.get_radius = function() {
        return self.graphics.graphicsData[0].shape.radius;
    }

    self.get_direction_force = function() {
        if (distance(self.get_position(), self.direction_point) > self.epsilon) {
            var direction_force = make_vector(self.get_position(), self.direction_point);
            set_length(direction_force, self.direction_force_module);
            return direction_force;
        } else {
            return new PIXI.Point(0, 0);
        }
    }

    self.get_resistance_force = function() {
        if (get_length(self.velocity) > self.velocity_epsilon) {
            var resistance_force = self.velocity.clone();
            set_length(resistance_force, -self.resistance_coefficient * get_length(self.velocity));
            return resistance_force;

        } else {
            self.velocity = new PIXI.Point(0, 0);
            return new PIXI.Point(0, 0);
        }
    }

    self.redraw = function() {
        var x, y;
        if (self.graphics !== undefined) {
            x = self.graphics.x;
            y = self.graphics.y;
            self.graphics.destroy();
        } else {
            x = in_x;
            y = in_y;
        }
        self.graphics = new PIXI.Graphics(); // Создаем новый графический элемент
        if (self.is_active) {
            self.graphics.lineStyle(5, 0x000000, 1); // Рисуем с рамкой
        } else {
            self.graphics.lineStyle(0); // Pисуем без рамки
        }
        self.graphics.beginFill(self.color, 1);
        self.graphics.drawCircle(
            0, 0, in_radius
        );
        self.graphics.setTransform(x, y);
        self.graphics.endFill(); // Закончили отрисовку
        self.graphics.interactive = true;
    };

    // Передвигает юнит в соответствии с импульсом и силами, действующими на него
    self.move = function(additional_forces) {
        var force = sum(self.get_direction_force(), self.get_resistance_force());
        if ((additional_forces !== undefined) && (additional_forces.length != 0)) {
            console.log(force, additional_forces)
            var additional_forces_sum = sum(additional_forces);
            force = sum(force, additional_forces_sum);
        }
        var acceleration = get_multiplied(force, 1 / self.mass);
        self.velocity = sum(self.velocity, acceleration);
        self.graphics.position = sum(self.graphics.position, self.velocity);
    };

    self.get_momentum = function() {
        return get_multiplied(self.velocity, self.mass);
    }

    self.take_momentum = function(momentum) {
        self.velocity = sum(self.velocity, get_multiplied(momentum, 1 / self.mass));
    }

    self.stop = function() {
        self.direction_point.copy(self.graphics.position);
    }
};


function touches(unit_1, unit_2) {
    return (distance(unit_1.get_position(), unit_2.get_position()) <= (unit_1.get_radius() + unit_2.get_radius()));
}
