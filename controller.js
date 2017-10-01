function Controller() {
    var self = this;
    self.bind = function() {
        application.view.onmousedown = function(event) {
            // Нажата ЛКМ. Создам точку начала выделяющиего прямоугольника.
            if (event.buttons == 1) {
                model.activating_rect = new PIXI.Graphics();
                model.activating_rect.lineStyle(2, 0x003300, 0.3);
                model.activating_rect.beginFill(0x005500, 0.3);
                model.activating_rect.drawRect(0, 0, 0, 0);
                model.activating_rect.setTransform(event.clientX, event.clientY);
                model.activating_rect.endFill();
                application.stage.addChild(model.activating_rect);
            }
        };

        application.view.onmouseup = function(event) {
            if ((event.buttons == 0) && (model.activating_rect !== undefined)) {
                // Все кнопки отпустили, но точка захватывающего прямоугольника и сам прямоугольник еще есть.
                // Проверяем, что внутри прямоугольника есть хоть один юнит
                var have_active_unit = false;
                for (var i = 0; i < model.units.length; ++i) {
                    var rectangle_contains_point = rect_contains_point(
                            model.activating_rect,
                            model.units[i].graphics.position,
                            model.activating_rect_x_reflected,
                            model.activating_rect_y_reflected
                    );
                    if (rectangle_contains_point) {
                        have_active_unit = true;
                        break;
                    }
                }
                // Сделаем активными все юниты внутри activating_rect, а остальные неактивными
                if (have_active_unit) {
                    model.active_units = [];
                    for (var i = 0; i < model.units.length; ++i) {
                        var rectangle_contains_point = rect_contains_point(
                                model.activating_rect,
                                model.units[i].graphics.position,
                                model.activating_rect_x_reflected,
                                model.activating_rect_y_reflected
                        );
                        if (rectangle_contains_point) {
                            model.set_active(model.units[i], true);
                            model.active_units.push(model.units[i]);
                        } else {
                            model.set_active(model.units[i], false);
                        }
                    }
                }

                // Теперь очищаем activating_rect 
                model.activating_rect.destroy();
                model.activating_rect = undefined;
            }
        };

        application.view.onmousemove = function(event) {
            // При движении мыши при зажатой ЛКМ надо перерисовать выделяющий прямоугольник
            // Тут все работает плохо! Удаляется старый прямоугольник и создается новый.
            // Хотелось бы менять параметры старого, но пока не получилось так сделать.
            // PIXI.Graphics.setTransform работает на красиво. Рамки прямоугольника рисуются странно.
            if (model.activating_rect !== undefined) {
                var x = model.activating_rect.x;
                var y = model.activating_rect.y;
                model.activating_rect.destroy();
                model.activating_rect = new PIXI.Graphics();
                model.activating_rect.lineStyle(2, 0x003300, 0.3);
                model.activating_rect.beginFill(0x005500, 0.3);
                model.activating_rect.drawRect(
                    0,
                    0,
                    event.clientX - x,
                    event.clientY - y
                );
                model.activating_rect.setTransform(x, y);
                model.activating_rect_x_reflected = ((event.clientX - x) < 0);
                model.activating_rect_y_reflected = ((event.clientY - y) < 0);
                model.activating_rect.endFill();
                application.stage.addChild(model.activating_rect);
            }
        }

        // При нажатии ПКМ меняем направление движения Unit'ов из model.active_units
        application.view.oncontextmenu = function(event) {
            for (var i = 0; i < model.active_units.length; ++i) {
                model.active_units[i].direction_point.x = event.clientX;
                model.active_units[i].direction_point.y = event.clientY;
            }
            return false;
        };

        // Надо забиндить все юниты на callback после клика
        // (а может там еще какие действия потом придумаются)
        for (var i = 0; i < model.units.length; ++i) {
            controller.bind_unit(model.units[i]);
        }

        addEventListener('keydown', function(event) {
            // Нажатие кнопки 's' или 'S' останавливает
            // движене всех выделенных юнитов
            if ((event.key == 's') || (event.key == 'S')) {
                for (var i = 0; i < model.active_units.length; ++i) {
                    model.active_units[i].stop();
                }
            }
        });

        // Основной событийный цикл
        application.ticker.add(function() {
            var additional_forces = {};
            for (var i = 0; i < model.units.length; ++i) {
                additional_forces[i] = [];
            }
            for (var i = 0; i < model.units.length; ++i) {
                // Обработка столкновений с другими юнитами
                for (var j = 0; j < model.units.length; ++j) {
                    if (i >= j) {
                        continue;
                    }
                    if (touches(model.units[i], model.units[j])) {
                        var direction = make_vector(model.units[i].get_position(), model.units[j].get_position());
                        normalize(direction);
                        
                        var m1 = model.units[i].mass;
                        var m2 = model.units[j].mass;
                        var v1 = get_projected_length(model.units[i].velocity, direction);
                        var v2 = get_projected_length(model.units[j].velocity, direction);
                        var p = m1 * v1 + m2 * v2;
                        var E = m1 * v1 * v1 + m2 * v2 * v2;

                        if (v2 > v1) {
                            var v2_final = (2 * p * m2 - Math.sqrt(4 * p * p * m2 * m2 - 4 * (p * p - m1 * E) * (m2 * m2 + m2 * m1))) / (2 * (m2 * m2 + m2 * m1));
                            var v1_final = (p - m2 * v2_final) / m1;
                        } else {
                            var v2_final = (2 * p * m2 + Math.sqrt(4 * p * p * m2 * m2 - 4 * (p * p - m1 * E) * (m2 * m2 + m2 * m1))) / (2 * (m2 * m2 + m2 * m1));
                            var v1_final = (p - m2 * v2_final) / m1;
                        }
                        var delta_v1 = v1_final - v1;
                        var delta_v2 = v2_final - v2;

                        model.units[i].take_momentum(
                            get_multiplied(direction, delta_v1 * model.units[i].mass)
                        );
                        model.units[i].move_back();
                        model.units[j].take_momentum(
                            get_multiplied(direction, delta_v2 * model.units[j].mass)
                        );
                        model.units[j].move_back();

                        var overlapping = model.units[i].get_radius() + model.units[j].get_radius() - distance(model.units[i].get_position(), model.units[j].get_position());
                        additional_forces[i].push(get_multiplied(direction, -overlapping * model.units[i].mass));
                        additional_forces[j].push(get_multiplied(direction, overlapping * model.units[j].mass));
                    }
                }

                // Обработка столкновений с препятствиями
                for (var j = 0; j < model.map.obstacles.length; ++j) {
                    var closest_point = get_closets_point(model.units[i].graphics, model.map.obstacles[j].graphics);
                    var radius = model.units[i].get_radius();
                    var current_distance = distance(closest_point, model.units[i].get_position());
                    if (current_distance < radius) {
                        model.units[i].take_momentum(get_reflecting_momentum(model.units[i], model.map.obstacles[j].graphics));
                        model.units[i].move_back();
                        var direction = make_vector(closest_point, model.units[i].get_position());
                        normalize(direction);
                        additional_forces[i].push(get_multiplied(direction, (radius - current_distance) * model.units[i].mass));
                    }
                }
            }
            for (var i = 0; i < model.units.length; ++i) {
                model.units[i].move(additional_forces[i]);
            }
        });
    }

    // callback после клика ЛКМ по каждому юниту.
    // Делает активным юнит, по которому кликнули, остальные становятся неактивными.
    // Для использование надо забиндить this на конкретный Unit
    self.click_callback = function() {
        model.active_units = [this];
        for (var j = 0; j < model.units.length; ++j) {
            model.set_active(model.units[j], false);
        }
        model.set_active(this, true);
    }

    self.bind_unit = function(unit) {
        unit.graphics.on('click', controller.click_callback.bind(unit));
    }
}
