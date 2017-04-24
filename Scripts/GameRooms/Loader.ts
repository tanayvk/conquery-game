/// <reference path="../Global.ts" />

module GameRooms {
	export class Loader extends Phaser.State {

		constructor() {
			super();
		}

		init() {
			var loaderBar = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 256, "loaderBar");
			loaderBar.anchor.setTo(0.5, 0.5);

			this.game.load.setPreloadSprite(loaderBar);
		}

		preload() {
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
		}

		create() {
			this.game.state.start("main-menu");
		}

	}
}
