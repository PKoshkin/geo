function Unit(in_x, in_y, in_radius=50) {
    this.in_x = in_x;
    this.in_y = in_y;
    this.in_radius = in_radius;
    this.direction_point = new PIXI.Point(in_x, in_y);
    this.color = 0xFF0000;
    // Нужно чтобы не делать очень маленькие
    // и бесплезные осциллирующие шаги, если юнит уже и так близко к цели.
    this.epsilon = 2;
    this.velocity_epsilon = 0.2;
    this.is_active = false;
    this.mass = 1;
    this.velocity = new PIXI.Point(0, 0); // Скорость
    this.direction_force_module = 0.5; // Модуль скорости в сторону точки назначения
    this.resistance_coefficient = 0.1; // Коэффициент сопротивления
};


Unit.prototype.get_position = function() {
    return this.graphics.position;
}


Unit.prototype.get_radius = function() {
    return this.graphics.graphicsData[0].shape.radius;
}


Unit.prototype.get_direction_force = function() {
    if (this.direction_point === undefined) {
        return new PIXI.Point(0, 0);
    }
    if (distance(this.get_position(), this.direction_point) > this.epsilon) {
        var direction_force = make_vector(this.get_position(), this.direction_point);
        set_length(direction_force, this.direction_force_module);
        return direction_force;
    } else {
        if (get_length(this.velocity) <= this.velocity_epsilon) {
            this.direction_point = undefined;
        }
        return new PIXI.Point(0, 0);
    }
}


Unit.prototype.get_resistance_force = function() {
    if (get_length(this.velocity) > this.velocity_epsilon) {
        var resistance_force = this.velocity.clone();
        set_length(resistance_force, -this.resistance_coefficient * get_length(this.velocity));
        return resistance_force;

    } else {
        this.velocity = new PIXI.Point(0, 0);
        return new PIXI.Point(0, 0);
    }
}


Unit.prototype.redraw = function() {
    var x, y;
    if (this.graphics !== undefined) {
        x = this.graphics.x;
        y = this.graphics.y;
        this.graphics.destroy();
    } else {
        x = this.in_x;
        y = this.in_y;
    }
    this.graphics = new PIXI.Graphics(); // Создаем новый графический элемент
    if (this.is_active) {
        this.graphics.lineStyle(5, 0x000000, 1); // Рисуем с рамкой
    } else {
        this.graphics.lineStyle(0); // Pисуем без рамки
    }
    this.graphics.beginFill(this.color, 1);
    this.graphics.drawCircle(
        0, 0, this.in_radius
    );
    this.graphics.setTransform(x, y);
    this.graphics.endFill(); // Закончили отрисовку
    this.graphics.interactive = true;
};


// Передвигает юнит в соответствии с импульсом и силами, действующими на него
Unit.prototype.move = function(additional_forces) {
    var force = sum(this.get_direction_force(), this.get_resistance_force());
    if ((additional_forces !== undefined) && (additional_forces.length != 0)) {
        var additional_forces_sum = sum(additional_forces);
        force = sum(force, additional_forces_sum);
    }
    var acceleration = get_multiplied(force, 1 / this.mass);
    this.previous_position = this.get_position();
    this.velocity = sum(this.velocity, acceleration);
    this.graphics.position = sum(this.graphics.position, this.velocity);
};


Unit.prototype.move_back = function() {
    this.graphics.position = this.previous_position;
}


Unit.prototype.get_momentum = function() {
    return get_multiplied(this.velocity, this.mass);
}


Unit.prototype.take_momentum = function(momentum) {
    this.velocity = sum(this.velocity, get_multiplied(momentum, 1 / this.mass));
}


Unit.prototype.stop = function() {
    this.direction_point.copy(this.graphics.position);
}


function touches(unit_1, unit_2) {
    return (distance(unit_1.get_position(), unit_2.get_position()) <= (unit_1.get_radius() + unit_2.get_radius()));
}
