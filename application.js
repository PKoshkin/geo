'use strict'

class Application {
    constructor() {
        let width = window.innerWidth; // Получаем ширину экрана
        let height = window.innerHeight; // Получаем высоту экрана
        PIXI.settings.RENDER_OPTIONS.backgroundColor = 0xFFFFFF;
        PIXI.settings.RENDER_OPTIONS.antialias = true;
        this.application = new PIXI.Application(width, height); // Создаем холст
        document.body.appendChild(this.application.view); // Выводим его в тело страницы

        this.map = new Map(this.application.stage);
        this.drawer = new Drawer(this.application.stage);
		this.controller = new Controller();
		this.controller.bind_signals();

		this.map.add_obsticle(new PolygonObsticle([
			new Point(100, 100), new Point(100, 200), new Point(200, 200)
		]));
    }
}
