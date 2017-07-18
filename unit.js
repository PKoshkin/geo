// Можно использовать как точку, а можно как вектор
function Point(in_x, in_y) {
    if ((in_x === undefined) || (in_y === undefined)) {
        this.x = 0;
        this.y = 0;
    } else {
        this.x = in_x;
        this.y = in_y;
    }

    this.add = function(vector) {
        this.x += vector.x;
        this.y += vector.y;
    };

    this.normalize = function() {
        var length = this.length();
        if (length != 0) {
            this.x /= length;
            this.y /= length;
        }
    };

    this.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    this.set_length = function(length) {
        this.normalize();
        this.x *= length;
        this.y *= length;
    };

    this.copy = function() {
        return new Point(this.x, this.y);
    };

    this.set = function(point) {
        this.x = point.x;
        this.y = point.y;
    };
};


function distance(point_1, point_2) {
    var x = point_2.x - point_1.x;
    var y = point_2.y - point_1.y;
    return Math.sqrt(x * x + y * y);
}


function make_vector(start_point, end_point) {
    return new Point(
        end_point.x - start_point.x,
        end_point.y - start_point.y
    );
}


function Unit(in_x, in_y) {
    var self = this;
    self.current_point = new Point(in_x, in_y);
    self.direction_point = new Point(in_x, in_y);
    self.step = 1;
    self.color = 0xFF0000;
    self.radius = 50;
    // Нужно чтобы не делать очень маленькие
    // и бесплезные осциллирующие шаги, если юнит уже и так близко к цели.
    self.epsilon = self.step;
    self.is_active = false;

    self.redraw = function() {
        if (self.pixi_graphics !== undefined) {
            self.pixi_graphics.destroy();
        }
        self.pixi_graphics = new PIXI.Graphics(); // Создаем новый графический элемент
        if (self.is_active) {
            self.pixi_graphics.lineStyle(5, 0x000000, 1);
        } else {
            self.pixi_graphics.lineStyle(0); // Начинаем рисовать без рамки
        }
        self.pixi_graphics.beginFill(self.color, 1); // Задаем цвет заполнения
        self.pixi_graphics.drawCircle(self.current_point.x, self.current_point.y, self.radius); // Рисуем кружок, ведь он наш дружок
        self.pixi_graphics.endFill(); // Закончили отрисовку
        self.pixi_graphics.interactive = true;
    };

    self.redraw();

    // Передвигает юнит в направлении direction_point на self.step
    self.move = function() {
        if (distance(self.current_point, self.direction_point) < self.epsilon) {
            return;
        }
        var direction = make_vector(self.current_point, self.direction_point);
        direction.set_length(self.step);
        self.current_point.add(direction);

        self.pixi_graphics.position.x += direction.x;
        self.pixi_graphics.position.y += direction.y;
    };

    self.stop = function() {
        self.direction_point.set(self.current_point);
    }
};
