/// <reference path="../Global.ts" />

module GameRooms {
	export class Loader extends Phaser.State {

		constructor() {
			super();
		}

		init() {
		}

		preload() {
			var loaderBar = this.game.add.sprite(this.game.world.centerX - 128, this.game.world.centerY + 256, "loaderBar");
			this.game.load.setPreloadSprite(loaderBar);

			Game.ui = this.game.plugins.add(Phaser.Plugin.SlickUI);

			this.game.load.tilemap("level", "Assets/Tilemaps/level.json", null, Phaser.Tilemap.TILED_JSON);

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
