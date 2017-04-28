module GameObjects {
	export class Player {
		health: number;
		progressBar;

		sprite: Phaser.Sprite;
		SPEED: number;

		isMoving: boolean;

		constructor(x, y) {
			this.sprite = Game.game.add.sprite(x, y, "player");
			this.sprite.anchor.setTo(0.5, 0.5);
			this.SPEED = 400;
			Game.game.physics.arcade.enable(this.sprite);

			this.health = 100;
			this.progressBar = new GameObjects.ProgressBar(Game.game.width - 200, 50, 150, 30, this.health);
			this.progressBar.setColors("#ff1111", "#11ff11");
		}

		Move() {
			this.isMoving = true;
			Game.game.physics.arcade.moveToPointer(this.sprite, this.SPEED);
		}

		Stop() {
			this.isMoving = false;
			this.sprite.body.velocity.x = 0;
			this.sprite.body.velocity.y = 0;
		}

		isNearPointer() {
			var mouseX = Game.game.input.mousePointer.x;
			var mouseY = Game.game.input.mousePointer.y;

			if(Phaser.Math.distance(this.sprite.x, this.sprite.y, Game.game.camera.x + mouseX, Game.game.camera.y + mouseY) <= 50){
				return true;
			}

			return false;
		}

		update() {
			if(Game.game.input.mousePointer.isDown && !this.isNearPointer()) {
				this.Move();
			}
			else {
				this.Stop();
			}

			if(this.health <= 0) {
				this.gameOver();
			}
		}

		render() {
			this.renderHealth();
		}

		renderHealth() {
			this.progressBar.percent = this.health;
			this.progressBar.draw();
		}

		gameOver() {
			Game.game.state.start("game-over", true, false, false);
		}
	}
}
