/// <reference path="../GameObjects/ProgressBar.ts" />

module GameRooms {
	export class MainRoom extends Phaser.State {

		player: GameObjects.Player;
		enemies: Array<GameObjects.Enemy>;

		pathfinder;

		bullet;

		backgroundLayer;
		blockedLayer;

		planet;
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

    		Global.blockedLayer = this.blockedLayer = Game.game.map.createLayer('collisions');
			Game.game.physics.arcade.enable(this.blockedLayer);
			Game.game.map.setCollisionBetween(1, 10000, true, this.blockedLayer);

			var tile_dimensions = new Phaser.Point(Game.game.map.tileWidth, Game.game.map.tileHeight);
			this.pathfinder = Game.game.plugins.add(Pathfinding, Game.game.map.layers[1].data, [-1], tile_dimensions);

			this.createPlanets();

			Global.enemies = this.enemies = new Array<GameObjects.Enemy>();
			this.createEnemies();

			this.createPlayer();
		}

		update() {
			Game.game.physics.arcade.collide(this.player.sprite, this.blockedLayer);

			this.player.update();
			this.updateEnemies();

			this.planet.update();

			var player = this.player;
			var blockedLayer = this.blockedLayer;

		}

		createPlanets() {
			this.planet = new GameObjects.Planet(750, 700);
		}

		createEnemies() {
			var enemy = new GameObjects.Enemy(160, 192, this.pathfinder);
			this.enemies.push(enemy);

			enemy = new GameObjects.Enemy(700, 600, this.pathfinder);
			this.enemies.push(enemy);
		}

		createPlayer() {
			this.player = new GameObjects.Player(1000, 1000);
			Global.player = this.player;
			Game.game.camera.follow(this.player.sprite);
		}

		render() {
			this.planet.render();
			Game.game.debug.text(this.planet.loadTimer.seconds);
		}

		updateEnemies() {

			this.enemies.forEach(function (enemy) {
				enemy.update();
				enemy.bullets.forEach(function(bullet) {
					Global.bullet = bullet;
					bullet.update();

					Game.game.physics.arcade.collide(Global.bullet.sprite, Global.player.sprite, null, function() {
						Global.bullet.sprite.destroy();
						Global.bullet = null;
					}, this);

					if(Global.bullet != null)
						Game.game.physics.arcade.collide(Global.bullet.sprite, Global.blockedLayer, null, function() {
							//Global.bullet.sprite.destroy();
						}, this);
				});
			});
		}

	}
}
