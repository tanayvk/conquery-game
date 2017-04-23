module GameRooms {
	export class MainRoom extends Phaser.State {

		player: GameObjects.Player;
		enemies: Array<GameObjects.Enemy>;
		enemy;
		pathfinder;

		bullet;

		backgroundLayer;
		blockedLayer;

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

			var tile_dimensions = new Phaser.Point(Game.game.map.tileWidth, Game.game.map.tileHeight);
			this.pathfinder = Game.game.plugins.add(Pathfinding, Game.game.map.layers[1].data, [-1], tile_dimensions);

			this.player = new GameObjects.Player(1000, 1000);
			// Game.game.camera.follow(this.player.sprite);

			this.enemy = new GameObjects.Enemy(160, 192);
			this.enemy.setPathFinder(this.pathfinder);
			// Game.game.time.events.loop(Phaser.Timer.SECOND, this.FollowPlayer, this);\
			Game.game.camera.follow(this.player.sprite);
		}

		update() {
			Game.game.physics.arcade.collide(this.player.sprite, this.blockedLayer);
			this.player.update();
			this.enemy.update();

			var player = this.player;
			var blockedLayer = this.blockedLayer;
			this.enemy.bullets.forEach(function(bullet) {
				Global.bullet = bullet;
				bullet.update();
				Game.game.physics.arcade.collide(bullet.sprite, player.sprite, null, function() {
					Global.bullet.sprite.destroy();
				}, this);
				if(bullet != null) {
					Game.game.physics.arcade.collide(bullet.sprite, blockedLayer, null, function() {
						//Global.bullet.sprite.destroy();
					}, this);
				}
			});

			var playerCoords = new Phaser.Point(this.player.sprite.x, this.player.sprite.y);
			if(this.enemy.canSeePlayer(playerCoords, this.blockedLayer)) {
				this.enemy.latestPlayerCoords = playerCoords;
				this.enemy.shootPlayer = true;
			} else {
				this.enemy.shootPlayer = false;
			}
		}

		// FollowPlayer() {
		// 	this.enemy.move_to(this.pathfinder, new Phaser.Point(this.player.sprite.x, this.player.sprite.y));
		// }

		render() {
			//Game.game.debug.cameraInfo(Game.game.camera, 32, 32);
		}
	}
}
