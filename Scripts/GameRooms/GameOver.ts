module GameRooms {
	export class GameOver extends Phaser.State {

		hasWon: boolean;
		PANEL_WIDTH: number;
		PANEL_HEIGHT: number;
		panel: SlickUI.Element.Panel;

		constructor(hasWon) {
			super();

			this.PANEL_WIDTH = 200;
			this.PANEL_HEIGHT = 140;
		}

		init(hasWon) {
			this.hasWon = hasWon;
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
			tryAgainButton.add(new SlickUI.Element.Text(0, 0, "Play Again")).center();

			var mainMenuButton;
			mainMenuButton = new SlickUI.Element.Button(10, 70, 170, 50);
			this.panel.add(mainMenuButton);
			mainMenuButton.events.onInputUp.add(this.mainMenu);
			mainMenuButton.add(new SlickUI.Element.Text(0, 0, "Main Menu")).center();

			if(this.hasWon) {
				var style = { font: "bold 32px Arial", fill: "#1f2", boundsAlignH: "center", boundsAlignV: "middle" };
				var text = Game.game.add.text(0, 0, "You win! You captured all the planets.", style);
				text.setTextBounds(0, 100, Game.game.width, Game.game.height);
			} else {
				var style = { font: "bold 32px Arial", fill: "#f12", boundsAlignH: "center", boundsAlignV: "middle" };
				var text = Game.game.add.text(0, 0, "You lose! You were killed by an enemy.", style);
				text.setTextBounds(0, 100, Game.game.width, Game.game.height);
			}
		}

		render () {
			// if(this.hasWon)
			// 	Game.game.debug.text("You won! You've captured all the planets.", Game.game.width / 2 - 200, Game.game.height / 2 + 200, "#11ff22");
			// else
			// 	Game.game.debug.text("You lose! You were killed by an enemy.", Game.game.width / 2 - 200, Game.game.height / 2 + 200, "#ff1122");
		}

		tryAgain() {
			Game.game.state.start("main-room");
		}

		mainMenu() {
			Game.game.state.start("main-menu");
		}

	}
}
