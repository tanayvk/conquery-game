module GameObjects {
	export class Player {
		sprite: Phaser.Sprite;
		SPEED: number;

		constructor(x, y) {
			this.sprite = Game.game.add.sprite(x, y, "player");
			this.sprite.anchor.setTo(0.5, 0.5);

			this.SPEED = 500;

			Game.game.physics.arcade.enable(this.sprite);
		}

		Move() {
			Game.game.physics.arcade.moveToPointer(this.sprite, this.SPEED);
		}

		Stop() {
			this.sprite.body.velocity.x = 0;
			this.sprite.body.velocity.y = 0;
		}

		isNearPointer() {
			var mouseX = Game.game.input.mousePointer.x;
			var mouseY = Game.game.input.mousePointer.y;

			if(Phaser.Math.distance(this.sprite.x, this.sprite.y, mouseX, mouseY) <= 50){
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
		}
	}
}
