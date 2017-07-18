var width = window.innerWidth; // Получаем ширину экрана
var height = window.innerHeight; // Получаем высоту экрана
var application; // Создаем глобальную переменную нашей игры


var model = {
    units: [],
    active_units: [], // Эти юниты получают новое направление движения при ЛКМ
    activating_rect: undefined,
    right_click_point: undefined,
    map: undefined,
    create_canvas: function() {
        PIXI.settings.RENDER_OPTIONS.backgroundColor = 0xFFFFFF;
        PIXI.settings.RENDER_OPTIONS.antialias = true;
        application = new PIXI.Application(width, height); // Создаем холст
        document.body.appendChild(application.view); // Выводим его в тело страницы
    },
    init_map: function() {
        model.map = new Map();
        var new_obstacle = new Obstacle(100, 100, 300, 300);
        model.map.obstacles.push(new_obstacle);
        model.draw_map();

        var unit_1 = new Unit(700, 100);
        model.add_unit(unit_1);
        var unit_2 = new Unit(1000, 100);
        model.add_unit(unit_2);
        var unit_3 = new Unit(1300, 100);
        model.add_unit(unit_3);
        var unit_4 = new Unit(700, 300);
        model.add_unit(unit_4);
        var unit_5 = new Unit(1000, 300);
        model.add_unit(unit_5);
        var unit_6 = new Unit(1300, 300);
        model.add_unit(unit_6);
        var unit_7 = new Unit(700, 500);
        model.add_unit(unit_7);
        var unit_8 = new Unit(1000, 500);
        model.add_unit(unit_8);
        var unit_9 = new Unit(1300, 500);
        model.add_unit(unit_9);
    },
    draw_map: function() {
        for (var i = 0; i < model.map.obstacles.length; ++i) {
            application.stage.addChild(model.map.obstacles[i].pixi_graphics);
        }
    },
    add_unit: function(unit) {
        unit.redraw();
        model.units.push(unit);
        controller.bind_unit(unit);
        application.stage.addChild(unit.pixi_graphics);
    },
    set_active: function(unit, is_active) {
        unit.is_active = is_active;
        unit.redraw();
        controller.bind_unit(unit);
        application.stage.addChild(unit.pixi_graphics);
    }
}


var view = {
    load_game: function() {
        model.create_canvas();
        model.init_map();
        controller.bind();

        application.ticker.add(function() {
            for (var i = 0; i < model.units.length; ++i) {
                model.units[i].move();
            }
        });
    }
}


var controller = {
    bind: function() {
        application.view.onmousedown = function(event) {
            // Нажата ЛКМ. Создам точку начала выделяющиего прямоугольника.
            if (event.buttons == 1) {
                model.right_click_point = new Point(event.clientX, event.clientY);
            }
        };

        application.view.onmouseup = function(event) {
            if ((event.buttons == 0) && (model.right_click_point !== undefined)) {
                if (model.activating_rect !== undefined) {
                    // Все кнопки отпустили, но точка захватывающего прямоугольника и сам прямоугольник еще есть.
                    // Проверяем, что внутри прямоугольника есть хоть один юнит
                    var have_active_unit = false;
                    for (var i = 0; i < model.units.length; ++i) {
                        if (model.activating_rect.containsPoint(model.units[i].current_point)) {
                            have_active_unit = true;
                            break;
                        }
                    }
                    // Сделаем активными все юниты внутри activating_rect, а остальные неактивными
                    if (have_active_unit) {
                        model.active_units = [];
                        for (var i = 0; i < model.units.length; ++i) {
                            if (model.activating_rect.containsPoint(model.units[i].current_point)) {
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
                // Очищаем right_click_point
                model.right_click_point = undefined;
            }
        };

        application.view.onmousemove = function(event) {
            // При движении мыши при зажатой ЛКМ надо перерисовать выделяющий прямоугольник
            // Тут все работает плохо! Удаляется старый прямоугольник и создается новый.
            // Хотелось бы менять параметры старого, но пока не получилось так сделать.
            // PIXI.Graphics.setTransform работает на красиво. Рамки прямоугольника рисуются странно.
            if (model.right_click_point !== undefined) {
                if (model.activating_rect !== undefined) {
                    model.activating_rect.destroy();
                }
                model.activating_rect = new PIXI.Graphics();
                model.activating_rect.lineStyle(2, 0x003300, 0.3);
                model.activating_rect.beginFill(0x005500, 0.3);
                model.activating_rect.drawRect(
                    model.right_click_point.x,
                    model.right_click_point.y,
                    event.clientX - model.right_click_point.x,
                    event.clientY - model.right_click_point.y
                );
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
    },
    // callback после клика ЛКМ по каждому юниту.
    // Делает активным юнит, по которому кликнули, остальные становятся неактивными.
    // Для использование надо забиндить this на конкретный Unit
    click_callback: function() {
        model.active_units = [this];
        for (var j = 0; j < model.units.length; ++j) {
            model.set_active(model.units[j], false);
        }
        model.set_active(this, true);
    },
    bind_unit: function(unit) {
        unit.pixi_graphics.on('click', controller.click_callback.bind(unit));
    }
}


view.load_game();
