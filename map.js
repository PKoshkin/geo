function Obstacle(path) {
    var self = this;
    self.color = 0x0000FF;

    self.redraw = function() {
        if (self.graphics !== undefined) {
            self.graphics.destroy();
        }
        self.graphics = new PIXI.Graphics(); // Создаем новый графический элемент
        self.graphics.beginFill(self.color, 1); // Задаем цвет заполнения
        self.graphics.drawPolygon(path); // Рисуем прямоугольник
        self.graphics.endFill(); // Закончили отрисовку
    };
    self.redraw();
}


function Map() {
    this.obstacles = [];
}
