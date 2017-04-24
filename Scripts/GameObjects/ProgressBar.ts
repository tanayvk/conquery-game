module GameObjects {
	export class ProgressBar {
		x: number;
		y: number;
		width: number;
		height: number;
		percent: number;

		text: String;
		showText: boolean;

		backgroundColor;
		foregroundColor;
		textColor;

		backRect;
		frontRect;

		fixedCamera: boolean;

		constructor(x, y, width, height, percent) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.percent = percent;

			this.text = "";
			this.showText = true;

			this.backgroundColor = "#ffffff";
			this.foregroundColor = "#ffff00";
			this.textColor = "#ffffff";

			this.fixedCamera = true;
		}

		setColors(backgroundColor, foregroundColor, textColor) {
			this.backgroundColor = backgroundColor;
			this.foregroundColor = foregroundColor;
			this.textColor = textColor;
		}

		setString(text) {
			this.text = text;
		}

		getWidth() {
			return ((this.percent / 100) * this.width);
		}

		draw() {
			if(this.fixedCamera) {
				var cameraX = Game.game.camera.x;
				var cameraY = Game.game.camera.y;

				this.backRect = new Phaser.Rectangle(cameraX + this.x, cameraY + this.y, this.width, this.height);
				this.frontRect = new Phaser.Rectangle(cameraX + this.x, cameraY + this.y, this.getWidth(), this.height);
			}
			else {
				this.backRect = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
				this.frontRect = new Phaser.Rectangle(this.x, this.y, this.getWidth(), this.height);
			}
			Game.game.debug.geom(this.backRect, this.backgroundColor);
			Game.game.debug.geom(this.frontRect, this.foregroundColor);

			if(this.showText)
				Game.game.debug.text(this.text, this.x, this.y - 10, this.textColor);
		}
	}
}
