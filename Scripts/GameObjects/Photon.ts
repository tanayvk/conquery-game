/// <reference path="../3rdParty/phaser.d.ts" />
/// <reference path="../app.ts" />

module GameObjects {
	export class Photon {
		p1: Phaser.Point;
		p2: Phaser.Point;
		wallSprite;
		sprite: Phaser.Sprite;

		velocity: Phaser.Point;
		constructor (p1, p2, wallSprite) {
			this.p1 = p1;
			this.p2 = p2;

			this.velocity = new Phaser.Point(0, 0);

			this.wallSprite = wallSprite;
		}

		calculate() {
			this.getVelocity();

			// Create a sprite for checking collisions
			this.sprite = Game.game.add.sprite(this.p1.x, this.p1.y);
			this.sprite.width = this.sprite.height = 32;
			this.sprite.anchor.setTo(0.5, 0.5);

			Game.game.physics.arcade.enable(this.sprite);
			this.sprite.visible = false;

			var distance = Phaser.Math.distance(this.sprite.x, this.sprite.y, this.p2.x, this.p2.y);
			while(distance > 16) {
				if(Game.game.physics.arcade.collide(this.sprite, this.wallSprite))
					return false;

				this.sprite.body.x = this.sprite.x += this.velocity.x;
				this.sprite.body.y = this.sprite.y += this.velocity.y;

				distance = Phaser.Math.distance(this.sprite.x, this.sprite.y, this.p2.x, this.p2.y);
				//console.log(distance);
			}
			this.sprite.destroy();
			return true;
		}

		isFree() {
			return this.calculate();
		}

		getVelocity() {
			this.velocity.x = this.p2.x - this.p1.x;
			this.velocity.y = this.p2.y - this.p1.y;

			this.velocity.normalize();
			this.velocity.divide(5, 5);
		}
	}
}
