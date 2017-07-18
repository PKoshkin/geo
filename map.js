function Obstacle(in_x, in_y, in_height, in_width) {
    var self = this;
    self.x = in_x;
    self.y = in_y;
    self.height = in_height;
    self.width = in_width;
    self.color = 0x0000FF;

    self.redraw = function() {
        if (self.pixi_graphics !== undefined) {
            self.pixi_graphics.destroy();
        }
        self.pixi_graphics = new PIXI.Graphics(); // Создаем новый графический элемент
        self.pixi_graphics.beginFill(self.color, 1); // Задаем цвет заполнения
        self.pixi_graphics.drawRect(self.x, self.y, self.width, self.width); // Рисуем прямоугольник
        self.pixi_graphics.endFill(); // Закончили отрисовку
    };
    self.redraw();
}


function Map() {
    this.obstacles = [];
}
