function Obstacle(in_x, in_y, in_width, in_height) {
    var self = this;
    self.color = 0x0000FF;

    self.redraw = function() {
        if (self.graphics !== undefined) {
            self.graphics.destroy();
        }
        self.graphics = new PIXI.Graphics(); // Создаем новый графический элемент
        self.graphics.beginFill(self.color, 1); // Задаем цвет заполнения
        self.graphics.drawRect(in_x, in_y, in_width, in_height); // Рисуем прямоугольник
        self.graphics.endFill(); // Закончили отрисовку
    };
    self.redraw();
}


function Map() {
    this.obstacles = [];
}
