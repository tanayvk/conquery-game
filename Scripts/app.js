var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameObjects;
(function (GameObjects) {
    var Player = (function () {
        function Player(x, y) {
            this.sprite = Game.game.add.sprite(x, y, "player");
            this.sprite.anchor.setTo(0.5, 0.5);
            this.SPEED = 400;
            Game.game.physics.arcade.enable(this.sprite);
            this.health = 100;
            this.progressBar = new GameObjects.ProgressBar(Game.game.width - 200, 50, 150, 30, this.health);
            this.progressBar.setColors("#ff1111", "#11ff11");
        }
        Player.prototype.Move = function () {
            this.isMoving = true;
            Game.game.physics.arcade.moveToPointer(this.sprite, this.SPEED);
        };
        Player.prototype.Stop = function () {
            this.isMoving = false;
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
        };
        Player.prototype.isNearPointer = function () {
            var mouseX = Game.game.input.mousePointer.x;
            var mouseY = Game.game.input.mousePointer.y;
            if (Phaser.Math.distance(this.sprite.x, this.sprite.y, Game.game.camera.x + mouseX, Game.game.camera.y + mouseY) <= 50) {
                return true;
            }
            return false;
        };
        Player.prototype.update = function () {
            if (Game.game.input.mousePointer.isDown && !this.isNearPointer()) {
                this.Move();
            }
            else {
                this.Stop();
            }
            if (this.health <= 0) {
                this.gameOver();
            }
        };
        Player.prototype.render = function () {
            this.renderHealth();
        };
        Player.prototype.renderHealth = function () {
            this.progressBar.percent = this.health;
            this.progressBar.draw();
        };
        Player.prototype.gameOver = function () {
            Game.game.state.start("game-over", true, false, false);
        };
        return Player;
    }());
    GameObjects.Player = Player;
})(GameObjects || (GameObjects = {}));
var GameObjects;
(function (GameObjects) {
    var Bullet = (function () {
        function Bullet(x, y, speed, color) {
            this.speed = speed;
            if (color == GameObjects.Bullet.BLUE_COLOR)
                this.sprite = Game.game.add.sprite(x, y, "bullet-blue");
            else if (color == GameObjects.Bullet.GREEN_COLOR)
                this.sprite = Game.game.add.sprite(x, y, "bullet-green");
            Game.game.physics.arcade.enable(this.sprite);
            this.sprite.anchor.setTo(0.5, 0.5);
            Game.game.time.events.add(Phaser.Timer.SECOND * 2, this.kill, this);
        }
        Bullet.prototype.update = function () {
            this.sprite.angle = (180 / Math.PI) * Math.atan2(this.sprite.body.velocity.y, this.sprite.body.velocity.x);
            if (Game.game.physics.arcade.collide(this.sprite, Global.blockedLayer)) {
                this.clean = true;
                var sound = Game.game.add.audio("wall-hit", Global.volume);
                sound.play();
            }
        };
        Bullet.prototype.towards = function (x, y) {
            var deltaX = x - this.sprite.x;
            var deltaY = y - this.sprite.y;
            var velocity = new Phaser.Point(deltaX, deltaY).normalize().multiply(this.speed, this.speed);
            this.sprite.body.velocity.setTo(velocity.x, velocity.y);
        };
        Bullet.prototype.kill = function () {
            if (this.sprite != undefined) {
                this.sprite.destroy();
                delete this.sprite;
            }
        };
        return Bullet;
    }());
    Bullet.BLUE_COLOR = 0;
    Bullet.GREEN_COLOR = 1;
    GameObjects.Bullet = Bullet;
})(GameObjects || (GameObjects = {}));
var GameRooms;
(function (GameRooms) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super.call(this) || this;
        }
        Boot.prototype.preload = function () {
            // Load resources for the loader state
            this.game.load.image("loaderBar", "Assets/images/loader_bar.png");
        };
        Boot.prototype.create = function () {
            this.game.stage.backgroundColor = "#000";
            this.game.stage.disableVisibilityChange = true;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.time.advancedTiming = true;
            this.game.state.start("loader");
        };
        return Boot;
    }(Phaser.State));
    GameRooms.Boot = Boot;
})(GameRooms || (GameRooms = {}));
var Global;
(function (Global) {
    Global.ui = null;
    Global.pathfinder = null;
    Global.bullet = null;
    Global.blockedLayer = null;
    Global.player = null;
    Global.enemies = null;
    Global.debug = false;
    Global.volume = 0.2;
    Global.musicVolume = 0.5;
})(Global || (Global = {}));
/// <reference path="../Global.ts" />
var GameRooms;
(function (GameRooms) {
    var Loader = (function (_super) {
        __extends(Loader, _super);
        function Loader() {
            return _super.call(this) || this;
        }
        Loader.prototype.init = function () {
        };
        Loader.prototype.preload = function () {
            var loaderBar = this.game.add.sprite(this.game.world.centerX - 128, this.game.world.centerY + 256, "loaderBar");
            this.game.load.setPreloadSprite(loaderBar);
            Game.ui = this.game.plugins.add(Phaser.Plugin.SlickUI);
            this.game.load.tilemap("level", "Assets/Tilemaps/level.json", null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image("player", "Assets/Images/player.png");
            this.game.load.image("enemy", "Assets/Images/enemy.png");
            this.game.load.image("wall", "Assets/Images/wall.png");
            this.game.load.image("bullet-blue", "Assets/Images/bullet-blue.png");
            this.game.load.image("bullet-green", "Assets/Images/bullet-green.png");
            this.game.load.image("planet", "Assets/Images/planet.png");
            this.game.load.image("planet_activated", "Assets/Images/planet_activated.png");
            this.game.load.image("game-over", "Assets/Images/game-over.png");
            this.game.load.audio("select", "Assets/Sounds/select.wav");
            this.game.load.audio("shoot", "Assets/Sounds/shoot.wav");
            this.game.load.audio("planet-activated", "Assets/Sounds/planet-activated.wav");
            this.game.load.audio("hit", "Assets/Sounds/hit.wav");
            this.game.load.audio("wall-hit", "Assets/Sounds/wall-hit.wav");
            this.game.load.audio("die", "Assets/Sounds/die.wav");
            this.game.load.audio("loop", "Assets/Sounds/automation.mp3");
            Game.ui.load("Assets/UI/kenney.json");
        };
        Loader.prototype.create = function () {
            var loop = Game.game.add.audio("loop", Global.musicVolume);
            loop.loopFull();
            this.game.state.start("main-menu");
        };
        return Loader;
    }(Phaser.State));
    GameRooms.Loader = Loader;
})(GameRooms || (GameRooms = {}));
var GameObjects;
(function (GameObjects) {
    var Planet = (function () {
        function Planet(x, y) {
            this.isActivated = false;
            this.sprite = Game.game.add.sprite(x, y, 'planet');
            this.sprite.anchor.setTo(0.5, 0.5);
            Game.game.physics.arcade.enable(this.sprite);
            this.actionKey = Game.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            this.loadTime = 3;
            this.loadTimer = Game.game.time.create(false);
            this.loadTimer.add(this.loadTime * Phaser.Timer.SECOND, this.activatePlanet, this);
            this.progressBar = new GameObjects.ProgressBar(Game.game.width / 2 - 100, Game.game.height - 100, 200, 30, 50);
            this.progressBar.setColors("#eeeeee", "#2233bb", "#ff1111");
            this.progressBar.showText = true;
            this.bullets = new Array();
            this.bulletSpeed = 1000;
            this.maxBullets = this.numOfBullets = 3;
            Game.game.time.events.loop(Phaser.Timer.SECOND / 3, this.giveBullet, this);
        }
        Planet.prototype.update = function () {
            if (!this.isActivated && this.actionKey.isDown && Game.game.physics.arcade.overlap(this.sprite, Global.player.sprite)) {
                if (this.loadTimer.seconds == 0)
                    this.loadTimer.start();
                else
                    this.loadTimer.resume();
                this.progressBar.text = "Capturing...";
            }
            else if (!this.isActivated) {
                this.progressBar.text = "Hold space to capture planet.";
                this.loadTimer.pause();
            }
            if (this.isActivated) {
                var planet = this;
                Global.enemies.forEach(function (enemy) {
                    if (planet.canSeeEnemy(enemy) && planet.numOfBullets > 0) {
                        planet.Shoot(enemy);
                        planet.numOfBullets--;
                    }
                });
            }
            this.cleanBulletsArray();
            this.bullets.forEach(function (bullet) {
                // if(bullet.sprite.body != null) {
                var bul = bullet;
                bullet.update();
                Global.enemies.forEach(function (enemy) {
                    if (Game.game.physics.arcade.overlap(enemy.sprite, bul.sprite)) {
                        bul.clean = true;
                        enemy.health = enemy.health - 5;
                        var sound = Game.game.add.audio("hit", Global.volume);
                        sound.play();
                    }
                });
                // }
            });
        };
        Planet.prototype.render = function () {
            if (!this.isActivated && Game.game.physics.arcade.overlap(this.sprite, Global.player.sprite)) {
                this.progressBar.percent = (this.loadTimer.seconds / this.loadTime) * 100;
                this.progressBar.draw();
            }
        };
        Planet.prototype.activatePlanet = function () {
            this.isActivated = true;
            this.loadTimer.destroy();
            delete this.loadTimer;
            delete this.progressBar;
            this.sprite.loadTexture('planet_activated');
            var sound = Game.game.add.audio("planet-activated", Global.volume);
            sound.play();
        };
        Planet.prototype.canSeeEnemy = function (enemy) {
            var myCoords = new Phaser.Point(this.sprite.x, this.sprite.y);
            var enemyCoords = new Phaser.Point(enemy.sprite.x, enemy.sprite.y);
            var photon = new GameObjects.Photon(myCoords, enemyCoords, Global.blockedLayer);
            return photon.isFree();
        };
        Planet.prototype.Shoot = function (enemy) {
            var bullet = new GameObjects.Bullet(this.sprite.x, this.sprite.y, this.bulletSpeed, GameObjects.Bullet.BLUE_COLOR);
            bullet.towards(enemy.sprite.x, enemy.sprite.y);
            this.bullets.push(bullet);
            var sound = Game.game.add.audio("shoot", Global.volume);
            sound.play();
        };
        Planet.prototype.getEnemiesArray = function () {
            if (this.enemiesArray == undefined) {
                this.enemiesArray = new Array();
                var planet = this;
                Global.enemies.forEach(function (enemy) {
                    planet.enemiesArray.push(enemy.sprite);
                });
            }
            return this.enemiesArray;
        };
        Planet.prototype.giveBullet = function () {
            if (this.numOfBullets != this.maxBullets)
                this.numOfBullets++;
        };
        Planet.prototype.cleanBulletsArray = function () {
            var bullets = this.bullets;
            var newBullets = new Array();
            this.bullets.forEach(function (bullet) {
                if (bullet.clean && bullet.sprite != undefined) {
                    bullet.sprite.destroy();
                }
                else if (bullet.sprite != undefined) {
                    newBullets.push(bullet);
                }
            });
            delete this.bullets;
            this.bullets = newBullets;
        };
        return Planet;
    }());
    GameObjects.Planet = Planet;
})(GameObjects || (GameObjects = {}));
/// <reference path="../GameObjects/Planet.ts" />
var GameRooms;
(function (GameRooms) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            var _this = _super.call(this) || this;
            _this.PANEL_WIDTH = 200;
            _this.PANEL_HEIGHT = 80;
            return _this;
        }
        MainMenu.prototype.preload = function () {
            Game.ui.load("Assets/UI/kenney.json");
        };
        MainMenu.prototype.create = function () {
            var panelX = this.game.width / 2 - this.PANEL_WIDTH / 2;
            var panelY = this.game.height / 2 - this.PANEL_HEIGHT / 2;
            this.panel = new SlickUI.Element.Panel(panelX, panelY, this.PANEL_WIDTH, this.PANEL_HEIGHT);
            Game.ui.add(this.panel);
            var newGameButton;
            newGameButton = new SlickUI.Element.Button(10, 10, 170, 50);
            this.panel.add(newGameButton);
            newGameButton.events.onInputUp.add(this.newGame);
            newGameButton.add(new SlickUI.Element.Text(0, 0, "Start")).center();
        };
        MainMenu.prototype.newGame = function () {
            var sound = Game.game.add.audio("select", Global.volume);
            sound.play();
            Game.game.state.start("main-room");
        };
        return MainMenu;
    }(Phaser.State));
    GameRooms.MainMenu = MainMenu;
})(GameRooms || (GameRooms = {}));
var GameObjects;
(function (GameObjects) {
    var ProgressBar = (function () {
        function ProgressBar(x, y, width, height, percent) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.percent = percent;
            this.text = "";
            this.showText = true;
            this.backgroundColor = "#ffffff";
            this.foregroundColor = "#ffff00";
            this.textColor = "#ffffff";
            this.fixedCamera = true;
        }
        ProgressBar.prototype.setColors = function (backgroundColor, foregroundColor, textColor) {
            this.backgroundColor = backgroundColor;
            this.foregroundColor = foregroundColor;
            this.textColor = textColor;
        };
        ProgressBar.prototype.setString = function (text) {
            this.text = text;
        };
        ProgressBar.prototype.getWidth = function () {
            return ((this.percent / 100) * this.width);
        };
        ProgressBar.prototype.draw = function () {
            if (this.fixedCamera) {
                var cameraX = Game.game.camera.x;
                var cameraY = Game.game.camera.y;
                this.backRect = new Phaser.Rectangle(cameraX + this.x, cameraY + this.y, this.width, this.height);
                this.frontRect = new Phaser.Rectangle(cameraX + this.x, cameraY + this.y, this.getWidth(), this.height);
            }
            else {
                this.backRect = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
                this.frontRect = new Phaser.Rectangle(this.x, this.y, this.getWidth(), this.height);
            }
            Game.game.debug.geom(this.backRect, this.backgroundColor);
            Game.game.debug.geom(this.frontRect, this.foregroundColor);
            if (this.showText)
                Game.game.debug.text(this.text, this.x, this.y - 10, this.textColor);
        };
        return ProgressBar;
    }());
    GameObjects.ProgressBar = ProgressBar;
})(GameObjects || (GameObjects = {}));
/// <reference path="../GameObjects/ProgressBar.ts" />
var GameRooms;
(function (GameRooms) {
    var MainRoom = (function (_super) {
        __extends(MainRoom, _super);
        function MainRoom() {
            return _super.call(this) || this;
        }
        MainRoom.prototype.create = function () {
            Game.game.map = this.game.add.tilemap('level');
            Game.game.map.addTilesetImage('wall', 'wall');
            this.backgroundLayer = Game.game.map.createLayer('backgroundLayer');
            this.backgroundLayer.resizeWorld();
            this.blockedLayer = Game.game.map.createLayer('collisions');
            Game.game.physics.arcade.enable(this.blockedLayer);
            Game.game.map.setCollisionBetween(1, 75 * 75, true, this.blockedLayer);
            Global.blockedLayer = this.blockedLayer;
            var tile_dimensions = new Phaser.Point(Game.game.map.tileWidth, Game.game.map.tileHeight);
            this.pathfinder = Game.game.plugins.add(Pathfinding, Game.game.map.layers[0].data, [-1], tile_dimensions);
            this.planets = new Array();
            this.createPlanets();
            Global.enemies = this.enemies = new Array();
            this.createEnemies();
            this.createPlayer();
        };
        MainRoom.prototype.update = function () {
            Game.game.physics.arcade.collide(this.player.sprite, this.blockedLayer);
            this.player.update();
            this.enemies.forEach(function (enemy) {
                if (!enemy.clean) {
                    enemy.update();
                    if (enemy.health <= 0) {
                        enemy.clean = true;
                        var sound = Game.game.add.sound("die", Global.volume);
                        sound.play();
                    }
                }
            });
            this.cleanEnemies();
            this.planets.forEach(function (planet) {
                planet.update();
            });
            if (this.hasWon()) {
                Game.game.state.start("game-over", true, false, true);
            }
        };
        MainRoom.prototype.createPlanets = function () {
            var planet = new GameObjects.Planet(41 * 32, 70 * 32);
            this.planets.push(planet);
            planet = new GameObjects.Planet(37 * 32, 37 * 32);
            this.planets.push(planet);
            planet = new GameObjects.Planet(13 * 32, 68 * 32);
            this.planets.push(planet);
            planet = new GameObjects.Planet(65 * 32, 67 * 32);
            this.planets.push(planet);
            var planet = new GameObjects.Planet(37 * 32, 6 * 32);
            this.planets.push(planet);
        };
        MainRoom.prototype.createEnemies = function () {
            var enemy = new GameObjects.Enemy(14 * 32, 56 * 32, this.pathfinder);
            enemy.addPatrolPoint(new Phaser.Point(14 * 32, 56 * 32));
            enemy.addPatrolPoint(new Phaser.Point(21 * 32, 59 * 32));
            this.enemies.push(enemy);
            var enemy = new GameObjects.Enemy(65 * 32, 67 * 32, this.pathfinder);
            enemy.addPatrolPoint(new Phaser.Point(65 * 32, 67 * 32));
            enemy.addPatrolPoint(new Phaser.Point(60 * 32, 63 * 32));
            this.enemies.push(enemy);
            var enemy = new GameObjects.Enemy(23 * 32, 33 * 32, this.pathfinder);
            enemy.addPatrolPoint(new Phaser.Point(23 * 32, 33 * 32));
            enemy.addPatrolPoint(new Phaser.Point(15 * 32, 39 * 32));
            this.enemies.push(enemy);
            var enemy = new GameObjects.Enemy(53 * 32, 32 * 32, this.pathfinder);
            enemy.addPatrolPoint(new Phaser.Point(53 * 32, 32 * 32));
            enemy.addPatrolPoint(new Phaser.Point(62 * 32, 34 * 32));
            this.enemies.push(enemy);
            var enemy = new GameObjects.Enemy(28 * 32, 2 * 32, this.pathfinder);
            enemy.addPatrolPoint(new Phaser.Point(28 * 32, 2 * 32));
            enemy.addPatrolPoint(new Phaser.Point(41 * 32, 15 * 32));
            this.enemies.push(enemy);
            var enemy = new GameObjects.Enemy(48 * 32, 2 * 32, this.pathfinder);
            enemy.addPatrolPoint(new Phaser.Point(48 * 32, 2 * 32));
            enemy.addPatrolPoint(new Phaser.Point(31 * 32, 15 * 32));
            this.enemies.push(enemy);
        };
        MainRoom.prototype.createPlayer = function () {
            this.player = new GameObjects.Player(36 * 32, 71 * 32);
            Global.player = this.player;
            Game.game.camera.follow(this.player.sprite);
        };
        MainRoom.prototype.render = function () {
            this.planets.forEach(function (planet) {
                planet.render();
            });
            this.enemies.forEach(function (enemy) {
                enemy.render();
            });
            this.player.render();
        };
        MainRoom.prototype.cleanEnemies = function () {
            var enemies = this.enemies;
            this.enemies.forEach(function (enemy) {
                if (enemy.clean) {
                    enemy.killProcesses();
                    enemy.sprite.destroy();
                    var index = enemies.indexOf(enemy);
                    delete enemies[index];
                    enemies.splice(index, 1);
                }
            });
        };
        MainRoom.prototype.hasWon = function () {
            var count = 0;
            this.planets.forEach(function (planet) {
                if (!planet.isActivated)
                    count++;
            });
            if (count > 0)
                return false;
            return true;
        };
        return MainRoom;
    }(Phaser.State));
    GameRooms.MainRoom = MainRoom;
})(GameRooms || (GameRooms = {}));
var GameRooms;
(function (GameRooms) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver(hasWon) {
            var _this = _super.call(this) || this;
            _this.PANEL_WIDTH = 200;
            _this.PANEL_HEIGHT = 140;
            return _this;
        }
        GameOver.prototype.init = function (hasWon) {
            this.hasWon = hasWon;
            this.game.add.sprite(0, 0, "game-over");
        };
        GameOver.prototype.preload = function () {
            Game.ui.load("Assets/UI/kenney.json");
        };
        GameOver.prototype.create = function () {
            var panelX = this.game.width / 2 - this.PANEL_WIDTH / 2;
            var panelY = this.game.height / 2 - this.PANEL_HEIGHT / 2;
            this.panel = new SlickUI.Element.Panel(panelX, panelY, this.PANEL_WIDTH, this.PANEL_HEIGHT);
            Game.ui.add(this.panel);
            var tryAgainButton;
            tryAgainButton = new SlickUI.Element.Button(10, 10, 170, 50);
            this.panel.add(tryAgainButton);
            tryAgainButton.events.onInputUp.add(this.tryAgain);
            tryAgainButton.add(new SlickUI.Element.Text(0, 0, "Play Again")).center();
            var mainMenuButton;
            mainMenuButton = new SlickUI.Element.Button(10, 70, 170, 50);
            this.panel.add(mainMenuButton);
            mainMenuButton.events.onInputUp.add(this.mainMenu);
            mainMenuButton.add(new SlickUI.Element.Text(0, 0, "Main Menu")).center();
            if (this.hasWon) {
                var style = { font: "bold 32px Arial", fill: "#1f2", boundsAlignH: "center", boundsAlignV: "middle" };
                var text = Game.game.add.text(0, 0, "You win! You captured all the planets.", style);
                text.setTextBounds(0, 100, Game.game.width, Game.game.height);
            }
            else {
                var style = { font: "bold 32px Arial", fill: "#f12", boundsAlignH: "center", boundsAlignV: "middle" };
                var text = Game.game.add.text(0, 0, "You lose! You were killed by an enemy.", style);
                text.setTextBounds(0, 100, Game.game.width, Game.game.height);
            }
        };
        GameOver.prototype.tryAgain = function () {
            Game.game.state.start("main-room");
            var sound = Game.game.add.audio("select", Global.volume);
            sound.play();
        };
        GameOver.prototype.mainMenu = function () {
            Game.game.state.start("main-menu");
            var sound = Game.game.add.audio("select", Global.volume);
            sound.play();
        };
        return GameOver;
    }(Phaser.State));
    GameRooms.GameOver = GameOver;
})(GameRooms || (GameRooms = {}));
/// <reference path="3rdParty/phaser.d.ts" />
/// <reference path="GameRooms/Boot.ts" />
/// <reference path="GameRooms/Loader.ts" />
/// <reference path="GameRooms/MainMenu.ts" />
/// <reference path="GameRooms/MainRoom.ts" />
/// <reference path="GameRooms/GameOver.ts" />
var Game;
(function (Game) {
    var TestGame = (function () {
        function TestGame() {
            Game.game = new Phaser.Game(1000, 750, Phaser.CANVAS, 'game', {
                create: this.create
            });
        }
        TestGame.prototype.create = function () {
            Game.game.state.add("boot", GameRooms.Boot);
            Game.game.state.add("loader", GameRooms.Loader);
            Game.game.state.add("main-menu", GameRooms.MainMenu);
            Game.game.state.add("main-room", GameRooms.MainRoom);
            Game.game.state.add("game-over", GameRooms.GameOver);
            Game.game.state.start("boot");
        };
        return TestGame;
    }());
    Game.TestGame = TestGame;
})(Game || (Game = {}));
window.onload = function () {
    var game = new Game.TestGame();
};
/// <reference path="../3rdParty/phaser.d.ts" />
/// <reference path="../app.ts" />
var GameObjects;
(function (GameObjects) {
    var Photon = (function () {
        function Photon(p1, p2, collisionLayer) {
            this.p1 = p1;
            this.p2 = p2;
            this.collisionLayer = collisionLayer;
        }
        Photon.prototype.calculate = function () {
            this.line = new Phaser.Line();
            this.line.start.set(this.p1.x, this.p1.y);
            this.line.end.set(this.p2.x, this.p2.y);
            this.line.width = 8;
            if (this.line.width > 750)
                return false;
            var tileHits = this.collisionLayer.getRayCastTiles(this.line, 8, true, true);
            if (tileHits.length > 0) {
                if (Global.debug == true)
                    for (var i = 0; i < tileHits.length; i++) {
                        tileHits[i].destroy();
                    }
                return false;
            }
            return true;
        };
        Photon.prototype.isFree = function () {
            return this.calculate();
        };
        return Photon;
    }());
    GameObjects.Photon = Photon;
})(GameObjects || (GameObjects = {}));
/// <reference path="../3rdParty/phaser.d.ts" />
/// <reference path="Bullet.ts" />
/// <reference path="Photon.ts" />
var GameObjects;
(function (GameObjects) {
    var Enemy = (function () {
        function Enemy(x, y, pathfinder) {
            this.sprite = Game.game.add.sprite(x, y, "enemy");
            this.sprite.anchor.setTo(0.5, 0.5);
            Game.game.physics.arcade.enable(this.sprite);
            this.speed = 100;
            this.health = 100;
            this.progressBar = new GameObjects.ProgressBar(this.sprite.x - 25, this.sprite.y - 25, 50, 10, this.health);
            this.progressBar.setColors("#dd5555", "#ff1111");
            this.progressBar.fixedCamera = false;
            this.bullets = new Array();
            this.bulletSpeed = 1000;
            this.numOfBullets = this.maxBullets = 1;
            this.pathfinder = pathfinder;
            this.patrolPoints = new Array();
            this.currentPatrol = 0;
            this.finishPath();
            this.followPlayerLoop = Game.game.time.events.loop(Phaser.Timer.SECOND / 3, this.followPlayer, this);
            this.giveBulletLoop = Game.game.time.events.loop(Phaser.Timer.SECOND / 4, this.giveBullet, this);
        }
        Enemy.prototype.update = function () {
            this.followPath();
            //Game.game.physics.arcade.collide(this.sprite, Global.blockedLayer);
            var playerCoords = new Phaser.Point(Global.player.sprite.x, Global.player.sprite.y);
            if (this.canSeePlayer()) {
                this.latestPlayerCoords = playerCoords;
                this.shootPlayer = true;
            }
            else {
                this.shootPlayer = false;
            }
            if (this.shootPlayer == true) {
                if (this.numOfBullets > 0) {
                    this.shootBullet();
                    this.numOfBullets--;
                }
            }
            this.cleanBulletsArray();
            this.updateBullets();
        };
        Enemy.prototype.reached_target_position = function (target_position) {
            var distance;
            distance = Phaser.Point.distance(this.sprite, target_position);
            return distance < 1;
        };
        Enemy.prototype.MoveTo = function (target_position) {
            this.pathfinder.find_path(this.sprite, target_position, this.move_through_path, this);
        };
        Enemy.prototype.move_through_path = function (path) {
            if (path !== null) {
                this.path = path;
                this.path_step = 0;
            }
            else {
                this.path = [];
            }
        };
        Enemy.prototype.resetPath = function () {
            this.path = [];
            this.path_step = -1;
        };
        Enemy.prototype.finishPath = function () {
            this.path = [];
            this.path_step = -1;
            this.Stop();
            if (this.patrolEvent != undefined) {
                Game.game.time.events.remove(this.patrolEvent);
                delete this.patrolEvent;
            }
            this.patrolEvent = Game.game.time.events.add(3 * Phaser.Timer.SECOND, this.Patrol, this);
        };
        Enemy.prototype.followPath = function () {
            var next_position, velocity;
            if (this.path.length > 0) {
                next_position = this.path[this.path_step];
                if (!this.reached_target_position(next_position)) {
                    velocity = new Phaser.Point(next_position.x - this.sprite.x, next_position.y - this.sprite.y);
                    velocity.normalize();
                    this.sprite.body.velocity.x = velocity.x * this.speed;
                    this.sprite.body.velocity.y = velocity.y * this.speed;
                }
                else {
                    this.sprite.x = next_position.x;
                    this.sprite.y = next_position.y;
                    if (this.path_step < this.path.length - 1) {
                        this.path_step += 1;
                    }
                    else {
                        this.finishPath();
                    }
                }
            }
        };
        Enemy.prototype.shootBullet = function () {
            var bullet = new GameObjects.Bullet(this.sprite.x, this.sprite.y, this.bulletSpeed, GameObjects.Bullet.GREEN_COLOR);
            bullet.towards(Global.player.sprite.x, Global.player.sprite.y);
            this.bullets.push(bullet);
            var sound = Game.game.add.audio("shoot", Global.volume);
            sound.play();
        };
        Enemy.prototype.Stop = function () {
            this.sprite.body.velocity.setTo(0, 0);
        };
        Enemy.prototype.canSeePlayer = function () {
            var playerCoords = new Phaser.Point(Global.player.sprite.x, Global.player.sprite.y);
            var photon = new GameObjects.Photon(new Phaser.Point(this.sprite.x, this.sprite.y), playerCoords, Global.blockedLayer);
            return photon.isFree();
        };
        Enemy.prototype.followPlayer = function () {
            if ((this.latestPlayerCoords != this.oldPlayerCoords)) {
                this.oldPlayerCoords = this.latestPlayerCoords;
                this.MoveTo(this.latestPlayerCoords);
            }
        };
        Enemy.prototype.giveBullet = function () {
            if (this.numOfBullets != this.maxBullets)
                this.numOfBullets++;
        };
        Enemy.prototype.Patrol = function () {
            if (!this.canSeePlayer() && this.patrolPoints.length > 0) {
                if (this.patrolPoints[++this.currentPatrol]) {
                    this.MoveTo(this.patrolPoints[this.currentPatrol]);
                }
                else {
                    this.currentPatrol = 0;
                    this.MoveTo(this.patrolPoints[0]);
                }
            }
        };
        Enemy.prototype.addPatrolPoint = function (point) {
            this.patrolPoints.push(point);
        };
        Enemy.prototype.cleanBulletsArray = function () {
            var bullets = this.bullets;
            var newBullets = new Array();
            this.bullets.forEach(function (bullet) {
                if (bullet.clean && bullet.sprite != undefined) {
                    bullet.sprite.destroy();
                    delete bullet.sprite;
                }
                else if (bullet.sprite != undefined) {
                    newBullets.push(bullet);
                }
            });
            delete this.bullets;
            this.bullets = newBullets;
        };
        Enemy.prototype.updateBullets = function () {
            this.bullets.forEach(function (bullet) {
                if (bullet.sprite != undefined) {
                    bullet.update();
                    Game.game.physics.arcade.overlap(bullet.sprite, Global.player.sprite, null, function () {
                        this.clean = true;
                        Global.player.health = Global.player.health - 5;
                        var sound = Game.game.add.audio("hit", Global.volume);
                        sound.play();
                    }, bullet);
                }
            });
        };
        Enemy.prototype.render = function () {
            this.renderHealth();
        };
        Enemy.prototype.renderHealth = function () {
            this.progressBar.x = this.sprite.x - 30;
            this.progressBar.y = this.sprite.y - 30;
            this.progressBar.width = 60;
            this.progressBar.height = 10;
            this.progressBar.percent = this.health;
            this.progressBar.draw();
        };
        Enemy.prototype.killProcesses = function () {
            Game.game.time.events.remove(this.patrolEvent);
            Game.game.time.events.remove(this.giveBulletLoop);
            Game.game.time.events.remove(this.followPlayerLoop);
        };
        return Enemy;
    }());
    GameObjects.Enemy = Enemy;
})(GameObjects || (GameObjects = {}));
