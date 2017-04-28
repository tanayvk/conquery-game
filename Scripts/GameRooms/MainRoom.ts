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
			Game.game.map = this.game.add.tilemap('level');
			Game.game.map.addTilesetImage('wall', 'wall');

			this.backgroundLayer = Game.game.map.createLayer('backgroundLayer');
			this.backgroundLayer.resizeWorld();

    		this.blockedLayer = Game.game.map.createLayer('collisions');
			Game.game.physics.arcade.enable(this.blockedLayer);
			Game.game.map.setCollisionBetween(1, 75*75, true, this.blockedLayer);
			Global.blockedLayer = this.blockedLayer;

			var tile_dimensions = new Phaser.Point(Game.game.map.tileWidth, Game.game.map.tileHeight);
			this.pathfinder = Game.game.plugins.add(Pathfinding, Game.game.map.layers[0].data, [-1], tile_dimensions);

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
					if(enemy.health <= 0) {
						enemy.clean = true;

						var sound = Game.game.add.sound("die", Global.volume);
						sound.play();
					}
				}
			});
			this.cleanEnemies();

			this.planets.forEach(function(planet) {
				planet.update();
			});

			if(this.hasWon()) {
				Game.game.state.start("game-over", true, false, true);
			}
		}

		createPlanets() {
			var planet = new GameObjects.Planet(41*32, 70*32);
			this.planets.push(planet);
			planet = new GameObjects.Planet(37*32, 37*32);
			this.planets.push(planet);
			planet = new GameObjects.Planet(13*32, 68*32);
			this.planets.push(planet);
			planet = new GameObjects.Planet(65*32, 67*32);
			this.planets.push(planet);
			var planet = new GameObjects.Planet(37*32, 6*32);
			this.planets.push(planet);
		}

		createEnemies() {
			var enemy = new GameObjects.Enemy(14*32, 56*32, this.pathfinder);
			enemy.addPatrolPoint(new Phaser.Point(14*32, 56*32));
			enemy.addPatrolPoint(new Phaser.Point(21*32, 59*32));
			this.enemies.push(enemy);
			var enemy = new GameObjects.Enemy(65*32, 67*32, this.pathfinder);
			enemy.addPatrolPoint(new Phaser.Point(65*32, 67*32));
			enemy.addPatrolPoint(new Phaser.Point(60*32, 63*32));
			this.enemies.push(enemy);
			var enemy = new GameObjects.Enemy(23*32, 33*32, this.pathfinder);
			enemy.addPatrolPoint(new Phaser.Point(23*32, 33*32));
			enemy.addPatrolPoint(new Phaser.Point(15*32, 39*32));
			this.enemies.push(enemy);
			var enemy = new GameObjects.Enemy(53*32, 32*32, this.pathfinder);
			enemy.addPatrolPoint(new Phaser.Point(53*32, 32*32));
			enemy.addPatrolPoint(new Phaser.Point(62*32, 34*32));
			this.enemies.push(enemy);
			var enemy = new GameObjects.Enemy(28*32, 2*32, this.pathfinder);
			enemy.addPatrolPoint(new Phaser.Point(28*32, 2*32));
			enemy.addPatrolPoint(new Phaser.Point(41*32, 15*32));
			this.enemies.push(enemy);
			var enemy = new GameObjects.Enemy(48*32, 2*32, this.pathfinder);
			enemy.addPatrolPoint(new Phaser.Point(48*32, 2*32));
			enemy.addPatrolPoint(new Phaser.Point(31*32, 15*32));
			this.enemies.push(enemy);
		}

		createPlayer() {
			this.player = new GameObjects.Player(36*32, 71*32);
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
		hasWon() {
			var count = 0;
			this.planets.forEach(function(planet) {
				if(!planet.isActivated)
					count++;
			});
			if(count > 0)
				return false;
			return true;
		}
	}
}
