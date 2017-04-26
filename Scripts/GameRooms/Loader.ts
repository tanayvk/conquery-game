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

			Game.ui.load("Assets/UI/kenney.json");
		}

		create() {
			this.game.state.start("main-menu");
		}

	}
}
