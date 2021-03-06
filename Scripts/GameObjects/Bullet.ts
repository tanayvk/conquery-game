module GameObjects {
	export class Bullet {

		sprite: Phaser.Sprite;
		speed: number;
		velocity: Phaser.Point;
		angle: number;
		clean: boolean;

		color: number;
		static BLUE_COLOR = 0;
		static GREEN_COLOR = 1;

		constructor(x, y, speed, color) {
			this.speed = speed;

			if(color == GameObjects.Bullet.BLUE_COLOR)
				this.sprite = Game.game.add.sprite(x, y, "bullet-blue");
			else if(color == GameObjects.Bullet.GREEN_COLOR)
				this.sprite = Game.game.add.sprite(x, y, "bullet-green");
			Game.game.physics.arcade.enable(this.sprite);

			this.sprite.anchor.setTo(0.5, 0.5);

			Game.game.time.events.add(Phaser.Timer.SECOND * 2, this.kill, this);
		}


		update() {
			this.sprite.angle = (180 / Math.PI) * Math.atan2(this.sprite.body.velocity.y, this.sprite.body.velocity.x);

			if(Game.game.physics.arcade.collide(this.sprite, Global.blockedLayer))
			{
				this.clean = true;

				var sound = Game.game.add.audio("wall-hit", Global.volume);
				sound.play();
			}
		}

		towards(x, y) {
			var deltaX = x - this.sprite.x;
			var deltaY = y - this.sprite.y;

			var velocity = new Phaser.Point(deltaX, deltaY).normalize().multiply(this.speed, this.speed);
			this.sprite.body.velocity.setTo(velocity.x, velocity.y);
		}

		kill() {
			if(this.sprite != undefined) {
				this.sprite.destroy();
				delete this.sprite;
			}
		}
	}
}
