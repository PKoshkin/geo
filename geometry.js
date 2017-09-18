var distance = polymorph(
    function(point_1, point_2) {
        var x = point_2.x - point_1.x;
        var y = point_2.y - point_1.y;
        return Math.sqrt(x * x + y * y);
    },

    // Расстояние от точки до отрезка
    function(begin_point, end_point, point) {
        return distance(point, get_closets_point(begin_point, end_point, point));
    }
)


function make_vector(start_point, end_point) {
    return new PIXI.Point(
        end_point.x - start_point.x,
        end_point.y - start_point.y
    );
}


function scalar_product(vector_1, vector_2) {
    return (vector_1.x * vector_2.x + vector_1.y * vector_2.y);
}


function get_angle_cos(vector_1, vector_2) {
    return scalar_product(vector_1, vector_2) / (get_length(vector_1) * get_length(vector_2));
}


var sum = polymorph(
    function sum(vector_1, vector_2) {
        return new PIXI.Point(
            vector_1.x + vector_2.x,
            vector_1.y + vector_2.y
        );
    },
    function sum(vectors) {
        if (vectors.length != 0) {
            var result = vectors[0];
            for (var i = 1; i < vectors.length; ++i) {
                result = sum(result, vectors[i]);
            }
            return result;
        } else {
            throw Error('Empty vectors array');
        }
    }
);


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


function get_multiplied(vector, alpha) {
    return new PIXI.Point(
        vector.x * alpha,
        vector.y * alpha
    );
}


// В PIXI полигонах точки хранятся как массив [x1, y1, x2, y2, ...]
// Хочется получать объект PIXI.Point, отвечающий i'ой точке
function get_polygon_point(path, i) {
    return new PIXI.Point(path[i * 2], path[i * 2 + 1]);
}


// Проверяет, пересекается ли граница полигона с кругом
function intersects(circle, polygon) {
    // Для начала надо найти ближайшую к точке центра круга точку на границе полигона
    var closest_point = get_closets_point(circle, polygon);
    var radius = circle.graphicsData[0].shape.radius;
    var center = new PIXI.Point(circle.x, circle.y);
    return (distance(closest_point, center) < radius);
}


// Проекция точки на направление вектора.
// Вектор считается направленным отрезком. Т.е. его концы закреплены.
function get_projection(vector_begin, vector_end, point) {
    var vector = make_vector(vector_begin, vector_end);
    var vector_to_point = make_vector(vector_begin, point);
    var length = get_length(vector_to_point) * get_angle_cos(vector_to_point, vector);
    set_length(vector, length);
    return new PIXI.Point(vector_begin.x + vector.x, vector_begin.y + vector.y);
}


var get_closets_point = polymorph(
    // Ближайшая к точке точка на отрезке
    function(begin_point, end_point, point) {
        var projection = get_projection(begin_point, end_point, point);
        var vector_1 = make_vector(projection, begin_point);
        var vector_2 = make_vector(projection, end_point);
        if (scalar_product(vector_1, vector_2) < 0) {
            return projection;
        } else if (distance(point, begin_point) < distance(point, end_point)) {
            return begin_point;
        } else {
            return end_point;
        }
    },

    function(circle, polygon) {
        // Для начала надо найти ближайшую к точке центра круга точку на границе полигона
        var center = new PIXI.Point(circle.x, circle.y);
        var path = polygon.graphicsData[0].shape.points;
        var closest_point = get_closets_point(
            get_polygon_point(path, 0),
            get_polygon_point(path, 1),
            center
        )
        var i = 1, j = 2;
        var points_number = Math.round(path.length / 2);
        while (i < points_number) {
            var ij_closets_point = get_closets_point(
                get_polygon_point(path, i),
                get_polygon_point(path, j),
                center
            );
            if (distance(ij_closets_point, center) < distance(closest_point, center)) {
                closest_point = ij_closets_point;
            }
            ++i;
            j = (j + 1) % points_number;
        }
        return closest_point
    }
);


function get_projected_length(vector, direction) {
    return get_length(vector) * get_angle_cos(vector, direction);
}


function get_reflecting_momentum(unit, polygon) {
    var closest_point = get_closets_point(unit.graphics, polygon);
    var reflecting_momentum = make_vector(closest_point, unit.get_position());
    set_length(reflecting_momentum, get_projected_length(unit.velocity, reflecting_momentum) * -2);
    return reflecting_momentum;
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
