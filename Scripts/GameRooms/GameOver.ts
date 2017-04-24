module GameRooms {
	export class GameOver extends Phaser.State {

		PANEL_WIDTH: number;
		PANEL_HEIGHT: number;
		panel: SlickUI.Element.Panel;

		constructor() {
			super();

			this.PANEL_WIDTH = 200;
			this.PANEL_HEIGHT = 140;
		}

		init() {
			this.game.add.sprite(0, 0, "game-over");
		}

		preload() {
			Game.ui.load("Assets/UI/kenney.json");
		}

		create() {
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
		}

		tryAgain() {
			Game.game.state.start("main-room");
		}

		mainMenu() {
			Game.game.state.start("main-menu");
		}

	}
}
