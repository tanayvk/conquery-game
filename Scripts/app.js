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
            this.SPEED = 500;
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
            if (this.health == 0) {
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
            Game.game.state.start("game-over");
        };
        return Player;
    }());
    GameObjects.Player = Player;
})(GameObjects || (GameObjects = {}));
var GameObjects;
(function (GameObjects) {
    var Bullet = (function () {
        function Bullet(x, y, speed) {
            this.speed = speed;
            this.sprite = Game.game.add.sprite(x, y, "bullet");
            Game.game.physics.arcade.enable(this.sprite);
            this.sprite.anchor.setTo(0.5, 0.5);
            Game.game.time.events.add(Phaser.Timer.SECOND * 3, this.sprite.destroy, this.sprite);
        }
        Bullet.prototype.update = function () {
            this.sprite.angle = (180 / Math.PI) * Math.atan2(this.sprite.body.velocity.y, this.sprite.body.velocity.x);
            Game.game.physics.arcade.collide(this.sprite, Global.blockedLayer, function () {
                this.clean = true;
            }, null, this);
        };
        Bullet.prototype.towards = function (x, y) {
            var deltaX = x - this.sprite.x;
            var deltaY = y - this.sprite.y;
            var velocity = new Phaser.Point(deltaX, deltaY).normalize().multiply(this.speed, this.speed);
            this.sprite.body.velocity.setTo(velocity.x, velocity.y);
        };
        return Bullet;
    }());
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
            Global.graphics = this.game.add.graphics(1000, 750);
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
            var loaderBar = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 256, "loaderBar");
            loaderBar.anchor.setTo(0.5, 0.5);
            this.game.load.setPreloadSprite(loaderBar);
        };
        Loader.prototype.preload = function () {
            Game.ui = this.game.plugins.add(Phaser.Plugin.SlickUI);
            this.game.load.tilemap("level2", "Assets/Tilemaps/level2.json", null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image("player", "Assets/Images/player.png");
            this.game.load.image("enemy", "Assets/Images/enemy.png");
            this.game.load.image("wall", "Assets/Images/wall.png");
            this.game.load.image("bullet", "Assets/Images/bullet.png");
            this.game.load.image("planet", "Assets/Images/planet.png");
            this.game.load.image("planet_activated", "Assets/Images/planet_activated.png");
            this.game.load.image("game-over", "Assets/Images/game-over.png");
            Game.ui.load("Assets/UI/kenney.json");
        };
        Loader.prototype.create = function () {
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
            else {
                this.progressBar.text = "Hold space to capture planet.";
                this.loadTimer.pause();
            }
            var planet = this;
            if (this.isActivated) {
                Global.enemies.forEach(function (enemy) {
                    if (planet.canSeeEnemy(enemy) && planet.numOfBullets > 0) {
                        planet.Shoot(enemy);
                        planet.numOfBullets--;
                    }
                });
            }
            this.bullets.forEach(function (bullet) {
                if (bullet != undefined && !bullet.clean) {
                    bullet.update();
                    Game.game.physics.arcade.overlap(bullet.sprite, planet.getEnemiesArray(), null, function () {
                        bullet.clean = true;
                    }, this);
                }
            });
            this.cleanBulletsArray();
        };
        Planet.prototype.render = function () {
            if (Game.game.physics.arcade.overlap(this.sprite, Global.player.sprite) && !this.isActivated) {
                this.progressBar.percent = (this.loadTimer.seconds / this.loadTime) * 100;
                this.progressBar.draw();
            }
        };
        Planet.prototype.activatePlanet = function () {
            this.isActivated = true;
            this.loadTimer.destroy();
            this.sprite.loadTexture('planet_activated');
        };
        Planet.prototype.canSeeEnemy = function (enemy) {
            var myCoords = new Phaser.Point(this.sprite.x, this.sprite.y);
            var enemyCoords = new Phaser.Point(enemy.sprite.x, enemy.sprite.y);
            var photon = new GameObjects.Photon(myCoords, enemyCoords, Global.blockedLayer);
            return photon.isFree();
        };
        Planet.prototype.Shoot = function (enemy) {
            var bullet = new GameObjects.Bullet(this.sprite.x, this.sprite.y, this.bulletSpeed);
            bullet.towards(enemy.sprite.x, enemy.sprite.y);
            this.bullets.push(bullet);
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
            var toBeDeleted = new Array();
            var bullets = this.bullets;
            this.bullets.forEach(function (bullet) {
                if (bullet.clean)
                    toBeDeleted.push(bullets.indexOf(bullet));
            });
            toBeDeleted.forEach(function (index) {
                bullets[index].sprite.destroy();
                delete bullets[index];
            });
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
            _this.PANEL_HEIGHT = 200;
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
            newGameButton.add(new SlickUI.Element.Text(0, 0, "New Game")).center();
        };
        MainMenu.prototype.newGame = function () {
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
            var cameraX = Game.game.camera.x;
            var cameraY = Game.game.camera.y;
            this.backRect = new Phaser.Rectangle(cameraX + this.x, cameraY + this.y, this.width, this.height);
            this.frontRect = new Phaser.Rectangle(cameraX + this.x, cameraY + this.y, this.getWidth(), this.height);
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
            Game.game.map = this.game.add.tilemap('level2');
            Game.game.map.addTilesetImage('player', 'player');
            Game.game.map.addTilesetImage('enemy', 'wall');
            this.backgroundLayer = Game.game.map.createLayer('backgroundLayer');
            this.backgroundLayer.resizeWorld();
            this.blockedLayer = Game.game.map.createLayer('collisions');
            Game.game.physics.arcade.enable(this.blockedLayer);
            Game.game.map.setCollisionBetween(1, 10000, true, this.blockedLayer);
            Global.blockedLayer = this.blockedLayer;
            var tile_dimensions = new Phaser.Point(Game.game.map.tileWidth, Game.game.map.tileHeight);
            this.pathfinder = Game.game.plugins.add(Pathfinding, Game.game.map.layers[1].data, [-1], tile_dimensions);
            this.planets = new Array();
            this.createPlanets();
            Global.enemies = this.enemies = new Array();
            this.createEnemies();
            this.createPlayer();
        };
        MainRoom.prototype.update = function () {
            Game.game.physics.arcade.collide(this.player.sprite, this.blockedLayer);
            this.player.update();
            this.updateEnemies();
            this.planets.forEach(function (planet) {
                planet.update();
            });
        };
        MainRoom.prototype.createPlanets = function () {
            var planet = new GameObjects.Planet(725, 700);
            this.planets.push(planet);
            planet = new GameObjects.Planet(900, 1000);
            this.planets.push(planet);
        };
        MainRoom.prototype.createEnemies = function () {
            var enemy = new GameObjects.Enemy(160, 192, this.pathfinder);
            enemy.addPatrolPoint(new Phaser.Point(160, 192));
            enemy.addPatrolPoint(new Phaser.Point(250, 1200));
            this.enemies.push(enemy);
            var enemy = new GameObjects.Enemy(250, 1200, this.pathfinder);
            enemy.addPatrolPoint(new Phaser.Point(250, 1200));
            enemy.addPatrolPoint(new Phaser.Point(160, 192));
            this.enemies.push(enemy);
        };
        MainRoom.prototype.createPlayer = function () {
            this.player = new GameObjects.Player(1000, 1000);
            Global.player = this.player;
            Game.game.camera.follow(this.player.sprite);
        };
        MainRoom.prototype.render = function () {
            this.planets.forEach(function (planet) {
                planet.render();
            });
            this.player.render();
            Game.game.debug.text(this.player.sprite.x + " " + this.player.sprite.y, 100, 150);
        };
        MainRoom.prototype.updateEnemies = function () {
            this.enemies.forEach(function (enemy) {
                enemy.update();
            });
        };
        return MainRoom;
    }(Phaser.State));
    GameRooms.MainRoom = MainRoom;
})(GameRooms || (GameRooms = {}));
var GameRooms;
(function (GameRooms) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver() {
            var _this = _super.call(this) || this;
            _this.PANEL_WIDTH = 200;
            _this.PANEL_HEIGHT = 140;
            return _this;
        }
        GameOver.prototype.init = function () {
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
            tryAgainButton.add(new SlickUI.Element.Text(0, 0, "Try Again")).center();
            var mainMenuButton;
            mainMenuButton = new SlickUI.Element.Button(10, 70, 170, 50);
            this.panel.add(mainMenuButton);
            mainMenuButton.events.onInputUp.add(this.mainMenu);
            mainMenuButton.add(new SlickUI.Element.Text(0, 0, "Main Menu")).center();
        };
        GameOver.prototype.tryAgain = function () {
            Game.game.state.start("main-room");
        };
        GameOver.prototype.mainMenu = function () {
            Game.game.state.start("main-menu");
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
        function Photon(p1, p2, wallSprite) {
            this.p1 = p1;
            this.p2 = p2;
            this.velocity = new Phaser.Point(0, 0);
            this.wallSprite = wallSprite;
        }
        Photon.prototype.calculate = function () {
            this.getVelocity();
            // Create a sprite for checking collisions
            this.sprite = Game.game.add.sprite(this.p1.x, this.p1.y);
            this.sprite.width = this.sprite.height = 5;
            this.sprite.anchor.setTo(0.5, 0.5);
            Game.game.physics.arcade.enable(this.sprite);
            this.sprite.visible = false;
            var distance = Phaser.Math.distance(this.sprite.x, this.sprite.y, this.p2.x, this.p2.y);
            while (distance > 16) {
                if (Game.game.physics.arcade.collide(this.sprite, this.wallSprite))
                    return false;
                this.sprite.body.x = this.sprite.x += this.velocity.x;
                this.sprite.body.y = this.sprite.y += this.velocity.y;
                distance = Phaser.Math.distance(this.sprite.x, this.sprite.y, this.p2.x, this.p2.y);
                //console.log(distance);
            }
            this.sprite.destroy();
            return true;
        };
        Photon.prototype.isFree = function () {
            return this.calculate();
        };
        Photon.prototype.getVelocity = function () {
            this.velocity.x = this.p2.x - this.p1.x;
            this.velocity.y = this.p2.y - this.p1.y;
            this.velocity.normalize();
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
            this.bullets = new Array();
            this.bulletSpeed = 1000;
            this.numOfBullets = this.maxBullets = 1;
            this.pathfinder = pathfinder;
            this.patrolPoints = new Array();
            this.currentPatrol = 0;
            this.resetPath();
            Game.game.time.events.loop(Phaser.Timer.SECOND / 1, this.followPlayer, this);
            Game.game.time.events.loop(Phaser.Timer.SECOND / 3, this.giveBullet, this);
        }
        Enemy.prototype.update = function () {
            this.cleanBulletsArray();
            this.followPath();
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
            this.Stop();
            Game.game.time.events.add(2 * Phaser.Timer.SECOND, this.Patrol, this);
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
                        this.resetPath();
                    }
                }
            }
        };
        Enemy.prototype.shootBullet = function () {
            var bullet = new GameObjects.Bullet(this.sprite.x, this.sprite.y, this.bulletSpeed);
            bullet.towards(this.latestPlayerCoords.x, this.latestPlayerCoords.y);
            this.bullets.push(bullet);
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
            if (this.canSeePlayer() && !Global.player.isMoving) {
                this.resetPath();
                return;
            }
            if ((this.latestPlayerCoords != this.oldPlayerCoords)) {
                this.oldPlayerCoords = this.latestPlayerCoords;
                //this.resetPath();
                this.MoveTo(this.latestPlayerCoords);
            }
        };
        Enemy.prototype.giveBullet = function () {
            if (this.numOfBullets != this.maxBullets)
                this.numOfBullets++;
        };
        Enemy.prototype.Patrol = function () {
            if (this.path = [] && !this.canSeePlayer() && this.patrolPoints.length > 0) {
                if (this.patrolPoints[++this.currentPatrol] != undefined) {
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
            var toBeDeleted = new Array();
            var bullets = this.bullets;
            this.bullets.forEach(function (bullet) {
                if (bullet.clean)
                    toBeDeleted.push(bullets.indexOf(bullet));
            });
            toBeDeleted.forEach(function (index) {
                bullets[index].sprite.destroy();
                delete bullets[index];
            });
        };
        Enemy.prototype.updateBullets = function () {
            this.bullets.forEach(function (bullet) {
                if (bullet != undefined && !bullet.clean) {
                    bullet.update();
                    var bullet = bullet;
                    Game.game.physics.arcade.collide(bullet.sprite, Global.player.sprite, null, function () {
                        bullet.clean = true;
                        Global.player.health--;
                    }, this);
                }
            });
        };
        return Enemy;
    }());
    GameObjects.Enemy = Enemy;
})(GameObjects || (GameObjects = {}));
