function Obstacle(in_path) {
    this.in_path = in_path;
    this.color = 0x0000FF;
    this.redraw();
}

Obstacle.prototype.redraw = function() {
    if (this.graphics !== undefined) {
        this.graphics.destroy();
    }
    this.graphics = new PIXI.Graphics(); // Создаем новый графический элемент
    this.graphics.beginFill(this.color, 1); // Задаем цвет заполнения
    this.graphics.drawPolygon(this.in_path); // Рисуем прямоугольник
    this.graphics.endFill(); // Закончили отрисовку
};


function Map() {
    this.obstacles = [];
}
