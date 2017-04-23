module GameObjects {
	export class ProgressBar {
		x: number;
		y: number;
		width: number;
		height: number;
		percent: number;

		backgroundColor;
		foregroundColor;

		backRect;
		frontRect;

		constructor(x, y, width, height, percent) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.percent = percent;

			this.backgroundColor = "#ffffff";
			this.foregroundColor = "#ffff00";
		}

		getWidth() {
			return ((this.percent / 100) * this.width);
		}

		draw() {
			var cameraX = Game.game.camera.x;
			var cameraY = Game.game.camera.y;

			this.backRect = new Phaser.Rectangle(cameraX + this.x, cameraY + this.y, this.width, this.height);
			this.frontRect = new Phaser.Rectangle(cameraX + this.x, cameraY + this.y, this.getWidth(), this.height);

			Game.game.debug.geom(this.backRect, this.backgroundColor);
			Game.game.debug.geom(this.frontRect, this.foregroundColor);
		}
	}
}
