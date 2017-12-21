'use strict'

class Application {
    constructor() {
        let width = window.innerWidth; // Получаем ширину экрана
        let height = window.innerHeight; // Получаем высоту экрана
        PIXI.settings.RENDER_OPTIONS.backgroundColor = 0xFFFFFF;
        PIXI.settings.RENDER_OPTIONS.antialias = true;
        this.application = new PIXI.Application(width, height); // Создаем холст
        document.body.appendChild(this.application.view); // Выводим его в тело страницы
    }
}
