/// <reference path="../GameObjects/Planet.ts" />

module GameRooms {
	export class MainMenu extends Phaser.State {

		PANEL_WIDTH: number;
		PANEL_HEIGHT: number;
		panel: SlickUI.Element.Panel;

		constructor() {
			super();

			this.PANEL_WIDTH = 200;
			this.PANEL_HEIGHT = 200;
		}

		preload() {
			Game.ui.load("Assets/UI/kenney.json");

		}

		create() {
			var panelX = this.game.world.centerX - this.PANEL_WIDTH / 2;
			var panelY = this.game.world.centerY - this.PANEL_HEIGHT / 2;

			this.panel = new SlickUI.Element.Panel(panelX, panelY, this.PANEL_WIDTH, this.PANEL_HEIGHT);
			Game.ui.add(this.panel);

			var newGameButton;
			newGameButton = new SlickUI.Element.Button(10, 10, 150, 50);

			this.panel.add(newGameButton);

			newGameButton.events.onInputUp.add(this.newGame);

			newGameButton.add(new SlickUI.Element.Text(0, 0, "New Game")).center();


            // var button;
            // this.panel.add(button = new SlickUI.Element.Button(0, 0, 140, 80));
            // button.events.onInputUp.add(function() { console.log('Clicked button'); });
            // button.add(new SlickUI.Element.Text(0, 0, "My button")).center();

		}

		newGame() {
			Game.game.state.start("main-room");
		}

	}
}
