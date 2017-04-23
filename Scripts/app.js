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
        }
        Player.prototype.Move = function () {
            Game.game.physics.arcade.moveToPointer(this.sprite, this.SPEED);
        };
        Player.prototype.Stop = function () {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
        };
        Player.prototype.isNearPointer = function () {
            var mouseX = Game.game.input.mousePointer.x;
            var mouseY = Game.game.input.mousePointer.y;
            if (Phaser.Math.distance(this.sprite.x, this.sprite.y, mouseX, mouseY) <= 50) {
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
        };
        return Player;
    }());
    GameObjects.Player = Player;
})(GameObjects || (GameObjects = {}));
var GameObjects;
(function (GameObjects) {
    var Bullet = (function () {
        function Bullet(x, y, angle, speed) {
            this.angle = angle;
            this.speed = speed;
            this.sprite = Game.game.add.sprite(x, y, "bullet");
            Game.game.physics.arcade.enable(this.sprite);
            this.sprite.anchor.setTo(0.5, 0.5);
            Game.game.time.events.add(Phaser.Timer.SECOND * 3, this.sprite.destroy, this.sprite);
        }
        Bullet.prototype.update = function () {
            this.sprite.angle = this.angle;
            this.sprite.x += Math.cos((Math.PI / 180) * this.angle) * this.speed;
            this.sprite.y += Math.sin((Math.PI / 180) * this.angle) * this.speed;
        };
        Bullet.prototype.towards = function (x, y) {
            var deltaX = x - this.sprite.x;
            var deltaY = y - this.sprite.y;
            this.angle = (180 / Math.PI) * Math.atan2(deltaY, deltaX);
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
    Global.graphics = null;
    Global.bullet = null;
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
        };
        Loader.prototype.create = function () {
            this.game.state.start("main-menu");
        };
        return Loader;
    }(Phaser.State));
    GameRooms.Loader = Loader;
})(GameRooms || (GameRooms = {}));
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
            var panelX = this.game.world.centerX - this.PANEL_WIDTH / 2;
            var panelY = this.game.world.centerY - this.PANEL_HEIGHT / 2;
            this.panel = new SlickUI.Element.Panel(panelX, panelY, this.PANEL_WIDTH, this.PANEL_HEIGHT);
            Game.ui.add(this.panel);
            var newGameButton;
            newGameButton = new SlickUI.Element.Button(10, 10, 150, 50);
            this.panel.add(newGameButton);
            newGameButton.events.onInputUp.add(this.newGame);
            newGameButton.add(new SlickUI.Element.Text(0, 0, "New Game")).center();
            // var button;
            // this.panel.add(button = new SlickUI.Element.Button(0, 0, 140, 80));
            // button.events.onInputUp.add(function() { console.log('Clicked button'); });
            // button.add(new SlickUI.Element.Text(0, 0, "My button")).center();
        };
        MainMenu.prototype.newGame = function () {
            Game.game.state.start("main-room");
        };
        return MainMenu;
    }(Phaser.State));
    GameRooms.MainMenu = MainMenu;
})(GameRooms || (GameRooms = {}));
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
            var tile_dimensions = new Phaser.Point(Game.game.map.tileWidth, Game.game.map.tileHeight);
            this.pathfinder = Game.game.plugins.add(Pathfinding, Game.game.map.layers[1].data, [-1], tile_dimensions);
            this.player = new GameObjects.Player(1000, 1000);
            // Game.game.camera.follow(this.player.sprite);
            this.enemy = new GameObjects.Enemy(160, 192);
            this.enemy.setPathFinder(this.pathfinder);
            // Game.game.time.events.loop(Phaser.Timer.SECOND, this.FollowPlayer, this);\
            Game.game.camera.follow(this.player.sprite);
        };
        MainRoom.prototype.update = function () {
            Game.game.physics.arcade.collide(this.player.sprite, this.blockedLayer);
            this.player.update();
            this.enemy.update();
            var player = this.player;
            var blockedLayer = this.blockedLayer;
            this.enemy.bullets.forEach(function (bullet) {
                Global.bullet = bullet;
                bullet.update();
                Game.game.physics.arcade.collide(bullet.sprite, player.sprite, null, function () {
                    Global.bullet.sprite.destroy();
                }, this);
                if (bullet != null) {
                    Game.game.physics.arcade.collide(bullet.sprite, blockedLayer, null, function () {
                        //Global.bullet.sprite.destroy();
                    }, this);
                }
            });
            var playerCoords = new Phaser.Point(this.player.sprite.x, this.player.sprite.y);
            if (this.enemy.canSeePlayer(playerCoords, this.blockedLayer)) {
                this.enemy.latestPlayerCoords = playerCoords;
                this.enemy.shootPlayer = true;
            }
            else {
                this.enemy.shootPlayer = false;
            }
        };
        // FollowPlayer() {
        // 	this.enemy.move_to(this.pathfinder, new Phaser.Point(this.player.sprite.x, this.player.sprite.y));
        // }
        MainRoom.prototype.render = function () {
            //Game.game.debug.cameraInfo(Game.game.camera, 32, 32);
        };
        return MainRoom;
    }(Phaser.State));
    GameRooms.MainRoom = MainRoom;
})(GameRooms || (GameRooms = {}));
/// <reference path="3rdParty/phaser.d.ts" />
/// <reference path="GameRooms/Boot.ts" />
/// <reference path="GameRooms/Loader.ts" />
/// <reference path="GameRooms/MainMenu.ts" />
/// <reference path="GameRooms/MainRoom.ts" />
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
            this.sprite.width = this.sprite.height = 32;
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
            this.velocity.divide(5, 5);
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
        function Enemy(x, y) {
            this.sprite = Game.game.add.sprite(x, y, "enemy");
            this.sprite.anchor.setTo(0.5, 0.5);
            Game.game.physics.arcade.enable(this.sprite);
            this.path = [];
            this.path_step = -1;
            this.speed = 300;
            this.bullets = new Array();
            this.bulletSpeed = 30;
            this.numOfBullets = this.maxBullets = 1;
            Game.game.time.events.loop(Phaser.Timer.SECOND / 2, this.followPlayer, this);
            Game.game.time.events.loop(Phaser.Timer.SECOND / 2, this.giveBullet, this);
        }
        Enemy.prototype.update = function () {
            this.followPath();
            if (this.shootPlayer == true) {
                if (this.numOfBullets > 0) {
                    this.shootBullet();
                    this.numOfBullets--;
                }
            }
        };
        Enemy.prototype.reached_target_position = function (target_position) {
            var distance;
            distance = Phaser.Point.distance(this.sprite, target_position);
            return distance < 3;
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
                        this.path = [];
                        this.path_step = -1;
                        this.sprite.body.velocity.x = 0;
                        this.sprite.body.velocity.y = 0;
                    }
                }
            }
        };
        Enemy.prototype.shootBullet = function () {
            var bullet = new GameObjects.Bullet(this.sprite.x, this.sprite.y, 0, this.bulletSpeed);
            bullet.towards(this.latestPlayerCoords.x, this.latestPlayerCoords.y);
            this.bullets.push(bullet);
        };
        Enemy.prototype.setPathFinder = function (pathfinder) {
            this.pathfinder = pathfinder;
        };
        Enemy.prototype.Stop = function () {
            this.sprite.body.velocity.setTo(0, 0);
        };
        Enemy.prototype.canSeePlayer = function (playerCoords, wallSprite) {
            var photon = new GameObjects.Photon(new Phaser.Point(this.sprite.x, this.sprite.y), playerCoords, wallSprite);
            return photon.isFree();
        };
        Enemy.prototype.followPlayer = function () {
            if (this.latestPlayerCoords != this.oldPlayerCoords) {
                this.oldPlayerCoords = this.latestPlayerCoords;
                this.resetPath();
                this.Stop();
                this.MoveTo(this.latestPlayerCoords);
            }
        };
        Enemy.prototype.giveBullet = function () {
            if (this.numOfBullets != this.maxBullets)
                this.numOfBullets++;
        };
        return Enemy;
    }());
    GameObjects.Enemy = Enemy;
})(GameObjects || (GameObjects = {}));
