var width = window.innerWidth; // Получаем ширину экрана
var height = window.innerHeight; // Получаем высоту экрана
PIXI.settings.RENDER_OPTIONS.backgroundColor = 0xFFFFFF;
PIXI.settings.RENDER_OPTIONS.antialias = true;
var application = new PIXI.Application(width, height); // Создаем холст
document.body.appendChild(application.view); // Выводим его в тело страницы
var model = new Model();
var controller = new Controller()
model.init_map();
controller.bind();
