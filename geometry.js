function distance(point_1, point_2) {
    var x = point_2.x - point_1.x;
    var y = point_2.y - point_1.y;
    return Math.sqrt(x * x + y * y);
}


function make_vector(start_point, end_point) {
    return new PIXI.Point(
        end_point.x - start_point.x,
        end_point.y - start_point.y
    );
}


function sum(vector_1, vector_2) {
    return new PIXI.Point(
        vector_1.x + vector_2.x,
        vector_1.y + vector_2.y
    );
}


function get_length(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}


function normalize(vector) {
    var length = get_length(vector);
    vector.x /= length;
    vector.y /= length;
}


function set_length(vector, length) {
    normalize(vector);
    vector.x *= length;
    vector.y *= length;
}


function is_circle(graphics) {
    return (graphics.graphicsData[0].shape.constructor === PIXI.Circle);
}


function is_rectangle(graphics) {
    return (graphics.graphicsData[0].shape.constructor === PIXI.Rectangle);
}


function get_angles(rectangle) {
    return [
        new PIXI.Point(rectangle.x, rectangle.y),
        new PIXI.Point(rectangle.x + rectangle.width, rectangle.y),
        new PIXI.Point(rectangle.x, rectangle.y + rectangle.height),
        new PIXI.Point(rectangle.x + rectangle.width, rectangle.y + rectangle.height)
    ];
}


function intersects(graphics_1, graphics_2) {
    if (is_circle(graphics_1) && is_circle(graphics_2)) {
        return (distance(graphics_1.position, graphics_2.position) < (graphics_1.radius + graphics_2.radius));
    } else if ((is_circle(graphics_1) && is_rectangle(graphics_2)) || (is_circle(graphics_2) && is_rectangle(graphics_1))) {
        var circle, rectangle;
        if (is_circle(graphics_1)) {
            circle = graphics_1;
            rectangle = graphics_2;
        } else {
            circle = graphics_2;
            rectangle = graphics_1;
        }
        var x_rect = new PIXI.Rectangle(
            rectangle.x - circle.radius,
            rectangle.y,
            rectangle.width + circle.radius * 2,
            rectangle.height
        );
        var y_rect = new PIXI.Rectangle(
            rectangle.x,
            rectangle.y - circle.radius,
            rectangle.width,
            rectangle.height + circle.radius * 2
        );
        var angles = get_angles(rectangle);
        return (
            (circle.containsPoint(angles[0])) ||
            (circle.containsPoint(angles[1])) ||
            (circle.containsPoint(angles[2])) ||
            (circle.containsPoint(angles[3])) ||
            (x_rect.contains(circle.position.x, circle.position.y)) ||
            (y_rect.contains(circle.position.x, circle.position.y))
        );
    } else {
        console.log('unknown intersect test');
    }
}


// PIXI.Graphics.containsPoint криво работает
// с прямоугольниками с отрицательными width и height
// (а точнее не работает)
// Мой вариант довольно отвратителен, но работает.
// Для этого он получает флаги, сообщающие отрицательны ли ширина и высота прямоугольника
function rect_contains_point(rect, point, rect_x_reflected, rect_y_reflected) {
    var min_x, min_y, max_x, max_y;
    if (rect_x_reflected) {
        min_x = model.activating_rect.x - model.activating_rect.width;
        max_x = model.activating_rect.x;
    } else {
        min_x = model.activating_rect.x;
        max_x = model.activating_rect.x + model.activating_rect.width;
    }
    if (rect_y_reflected) {
        min_y = model.activating_rect.y - model.activating_rect.height;
        max_y = model.activating_rect.y;
    } else {
        min_y = model.activating_rect.y;
        max_y = model.activating_rect.y + model.activating_rect.height;
    }
    return (
        (min_x <= point.x) &&
        (point.x <= max_x) &&
        (min_y <= point.y) &&
        (point.y <= max_y)
    );
}