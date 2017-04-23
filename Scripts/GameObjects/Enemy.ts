/// <reference path="../3rdParty/phaser.d.ts" />
/// <reference path="Bullet.ts" />
/// <reference path="Photon.ts" />

module GameObjects {
	export class Enemy {
		sprite: Phaser.Sprite;
		pathfinder;

		speed: number;

		path;
		path_step;

		bullets: Array<GameObjects.Bullet>;
		bulletSpeed: number;

		latestPlayerCoords: Phaser.Point;
		oldPlayerCoords: Phaser.Point;
		shootPlayer: boolean;

		constructor(x, y) {
			this.sprite = Game.game.add.sprite(x, y, "enemy");
			this.sprite.anchor.setTo(0.5, 0.5);
			Game.game.physics.arcade.enable(this.sprite);

			this.path = [];
			this.path_step = -1;

			this.speed = 300;

			this.bullets = new Array<GameObjects.Bullet>();
			this.bulletSpeed = 30;

			Game.game.time.events.loop(Phaser.Timer.SECOND, this.followPlayer, this);
		}

		update() {
			this.followPath();

			if(this.shootPlayer == true) {
				this.shootBullet();
			}
		}

		reached_target_position(target_position) {
		    var distance;
		    distance = Phaser.Point.distance(this.sprite, target_position);
		    return distance < 3;
		}

		MoveTo(target_position) {
		    this.pathfinder.find_path(this.sprite, target_position, this.move_through_path, this);
		}

		move_through_path(path) {
		    if (path !== null) {
		        this.path = path;
		        this.path_step = 0;
		    } else {
		        this.path = [];
			}
		}

		resetPath() {
			this.path = [];
			this.path_step = -1;
		}

		followPath() {
			var next_position, velocity;

			if (this.path.length > 0) {
				next_position = this.path[this.path_step];

				if (!this.reached_target_position(next_position)) {
					velocity = new Phaser.Point(next_position.x - this.sprite.x,
										   next_position.y - this.sprite.y);
					velocity.normalize();
					this.sprite.body.velocity.x = velocity.x * this.speed;
					this.sprite.body.velocity.y = velocity.y * this.speed;
				} else {
					this.sprite.x = next_position.x;
					this.sprite.y = next_position.y;
					if (this.path_step < this.path.length - 1) {
						this.path_step += 1;
					} else {
						this.path = [];
						this.path_step = -1;
						this.sprite.body.velocity.x = 0;
						this.sprite.body.velocity.y = 0;
					}
				}
			}
		}

		shootBullet() {
			var bullet = new GameObjects.Bullet(this.sprite.x, this.sprite.y, 0, this.bulletSpeed);
			bullet.towards(this.latestPlayerCoords.x, this.latestPlayerCoords.y);
			this.bullets.push(bullet);
		}

		setPathFinder(pathfinder) {
			this.pathfinder = pathfinder;
		}

		Stop() {
			this.sprite.body.velocity.setTo(0, 0);
		}

		canSeePlayer(playerCoords, wallSprite) {
			var photon = new GameObjects.Photon(new Phaser.Point(this.sprite.x, this.sprite.y), playerCoords, wallSprite);
			return photon.isFree();
		}

		followPlayer() {
			if(this.latestPlayerCoords != this.oldPlayerCoords) {
				this.oldPlayerCoords = this.latestPlayerCoords;

				this.resetPath();
				this.Stop();
				this.MoveTo(this.latestPlayerCoords);
			}
		}

	}
}
