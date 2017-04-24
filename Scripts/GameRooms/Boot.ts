module GameRooms {
	export class Boot extends Phaser.State {

		constructor() {
			super();
		}

		preload() {
			// Load resources for the loader state
			this.game.load.image("loaderBar", "Assets/images/loader_bar.png");
		}

		create() {
			this.game.stage.backgroundColor = "#000";
			this.game.stage.disableVisibilityChange = true;
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.time.advancedTiming = true;
			this.game.state.start("loader");
		}

	}
}
