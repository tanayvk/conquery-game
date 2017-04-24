/// <reference path="../GameObjects/ProgressBar.ts" />

module GameRooms {
	export class MainRoom extends Phaser.State {

		player: GameObjects.Player;
		enemies: Array<GameObjects.Enemy>;

		pathfinder;

		bullet;

		backgroundLayer;
		blockedLayer;

		planets: Array<GameObjects.Planet>;
		progressBar;

		constructor() {
			super();
		}

		create() {
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

			this.planets = new Array<GameObjects.Planet>();
			this.createPlanets();

			Global.enemies = this.enemies = new Array<GameObjects.Enemy>();
			this.createEnemies();

			this.createPlayer();
		}

		update() {
			Game.game.physics.arcade.collide(this.player.sprite, this.blockedLayer);

			this.player.update();

			this.enemies.forEach(function (enemy) {
				if(!enemy.clean) {
					enemy.update();
					if(enemy.health <= 0)
						enemy.clean = true;;
				}
			});
			this.cleanEnemies();

			this.planets.forEach(function(planet) {
				planet.update();
			})
		}

		createPlanets() {
			var planet = new GameObjects.Planet(725, 700);
			this.planets.push(planet);

			planet = new GameObjects.Planet(900, 1000);
			this.planets.push(planet);
		}

		createEnemies() {
			var enemy = new GameObjects.Enemy(160, 192, this.pathfinder);
			enemy.addPatrolPoint(new Phaser.Point(160, 192));
			enemy.addPatrolPoint(new Phaser.Point(250, 1200));

			this.enemies.push(enemy);

			var enemy = new GameObjects.Enemy(250, 1200, this.pathfinder);
			enemy.addPatrolPoint(new Phaser.Point(250, 1200));
			enemy.addPatrolPoint(new Phaser.Point(160, 192));

			this.enemies.push(enemy);

		}

		createPlayer() {
			this.player = new GameObjects.Player(1000, 1000);
			Global.player = this.player;
			Game.game.camera.follow(this.player.sprite);
		}

		render() {
			this.planets.forEach(function(planet) {
				planet.render();
			});
			this.enemies.forEach(function(enemy) {
				enemy.render();
			});

			this.player.render();
			Game.game.debug.text(Game.game.time.fps, 50, 50);
		}

		cleanEnemies() {
			var enemies = this.enemies;
			this.enemies.forEach(function(enemy) {
				if(enemy.clean)
				{
					enemy.killProcesses();
					enemy.sprite.destroy();
					var index = enemies.indexOf(enemy);
					delete enemies[index];
					enemies.splice(index, 1);
				}
			});
		}
	}
}
