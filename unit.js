function Unit(in_x, in_y) {
    var self = this;
    self.direction_point = new PIXI.Point(in_x, in_y);
    self.step = 1;
    self.color = 0xFF0000;
    self.radius = 50;
    // Нужно чтобы не делать очень маленькие
    // и бесплезные осциллирующие шаги, если юнит уже и так близко к цели.
    self.epsilon = self.step;
    self.is_active = false;

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
            0, 0, self.radius
        );
        self.graphics.setTransform(x, y);
        self.graphics.endFill(); // Закончили отрисовку
        self.graphics.interactive = true;
    };

    // Передвигает юнит в направлении direction_point на self.step
    self.move = function() {
        if (distance(self.graphics.position, self.direction_point) < self.epsilon) {
            return;
        }
        var direction = make_vector(self.graphics.position, self.direction_point);
        set_length(direction, self.step);
        self.graphics.position = sum(self.graphics.position, direction);
    };

    // Передвигает юнит обрытном направлению движения направлении на self.step
    // Нужно чтоб шагнуть назад, если врезались в препятствие
    self.move_back = function() {
        var direction = make_vector(self.direction_point, self.graphics.position);
        set_length(direction, self.step);
        self.graphics.position = sum(self.graphics.position, direction);
    };

    self.stop = function() {
        self.direction_point.copy(self.graphics.position);
    }
};
