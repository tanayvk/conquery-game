module GameObjects {
	export class Bullet {

		sprite: Phaser.Sprite;
		speed: number;
		angle: number;

		constructor(x, y, angle, speed) {
			this.angle = angle;
			this.speed = speed;

			this.sprite = Game.game.add.sprite(x, y, "bullet");
			Game.game.physics.arcade.enable(this.sprite);
			
			this.sprite.anchor.setTo(0.5, 0.5);

			Game.game.time.events.add(Phaser.Timer.SECOND * 3, this.sprite.destroy, this.sprite);
		}


		update() {
			this.sprite.angle = this.angle;

			this.sprite.x += Math.cos((Math.PI / 180) * this.angle) * this.speed;
			this.sprite.y += Math.sin((Math.PI / 180) * this.angle) * this.speed;
		}

		towards(x, y) {
			var deltaX = x - this.sprite.x;
			var deltaY = y - this.sprite.y;

			this.angle = (180 / Math.PI) * Math.atan2(deltaY, deltaX);
		}
	}
}
