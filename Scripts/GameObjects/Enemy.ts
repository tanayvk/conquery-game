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
		numOfBullets: number;
		maxBullets: number;

		latestPlayerCoords: Phaser.Point;
		oldPlayerCoords: Phaser.Point;
		shootPlayer: boolean;

		patrolPoints: Array<Phaser.Point>;
		currentPatrol: number;
		isPatrolling: boolean;

		constructor(x, y, pathfinder) {
			this.sprite = Game.game.add.sprite(x, y, "enemy");
			this.sprite.anchor.setTo(0.5, 0.5);
			Game.game.physics.arcade.enable(this.sprite);

			this.speed = 100;

			this.bullets = new Array<GameObjects.Bullet>();
			this.bulletSpeed = 1000;
			this.numOfBullets = this.maxBullets = 1;

			this.pathfinder = pathfinder;
			this.patrolPoints = new Array<Phaser.Point>();
			this.currentPatrol = 0;
			this.resetPath();

			Game.game.time.events.loop(Phaser.Timer.SECOND / 1, this.followPlayer, this);
			Game.game.time.events.loop(Phaser.Timer.SECOND / 3, this.giveBullet, this);
		}

		update() {
			this.cleanBulletsArray();
			this.followPath();

			var playerCoords = new Phaser.Point(Global.player.sprite.x, Global.player.sprite.y);
			if(this.canSeePlayer()) {
				this.latestPlayerCoords = playerCoords;
				this.shootPlayer = true;
			} else {
				this.shootPlayer = false;
			}

			if(this.shootPlayer == true) {
				if(this.numOfBullets > 0) {
					this.shootBullet();
					this.numOfBullets--;
				}
			}
			this.updateBullets();
		}

		reached_target_position(target_position) {
		    var distance;
		    distance = Phaser.Point.distance(this.sprite, target_position);
		    return distance < 1;
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

			this.Stop();
			Game.game.time.events.add(2 * Phaser.Timer.SECOND, this.Patrol, this);
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
						this.resetPath();
					}
				}
			}
		}

		shootBullet() {
			var bullet = new GameObjects.Bullet(this.sprite.x, this.sprite.y, this.bulletSpeed);
			bullet.towards(this.latestPlayerCoords.x, this.latestPlayerCoords.y);
			this.bullets.push(bullet);
		}

		Stop() {
			this.sprite.body.velocity.setTo(0, 0);
		}

		canSeePlayer() {
			var playerCoords = new Phaser.Point(Global.player.sprite.x, Global.player.sprite.y);
			var photon = new GameObjects.Photon(new Phaser.Point(this.sprite.x, this.sprite.y), playerCoords, Global.blockedLayer);
			return photon.isFree();
		}

		followPlayer() {

			if(this.canSeePlayer() && !Global.player.isMoving)
			{
				this.resetPath();
				return;
			}

			if((this.latestPlayerCoords != this.oldPlayerCoords)) {
				this.oldPlayerCoords = this.latestPlayerCoords;

				//this.resetPath();
				this.MoveTo(this.latestPlayerCoords);
			}
		}

		giveBullet() {
			if(this.numOfBullets != this.maxBullets)
				this.numOfBullets++;
		}

		Patrol() {
			if(this.path = [] && !this.canSeePlayer() && this.patrolPoints.length > 0) {
				if(this.patrolPoints[++this.currentPatrol] != undefined) {
					this.MoveTo(this.patrolPoints[this.currentPatrol]);
				} else {
					this.currentPatrol = 0;
					this.MoveTo(this.patrolPoints[0]);
				}
			}
		}

		addPatrolPoint(point) {
			this.patrolPoints.push(point);
		}

		cleanBulletsArray() {
			var toBeDeleted = new Array<number>();
			var bullets = this.bullets;
			this.bullets.forEach(function(bullet) {
				if(bullet.clean)
					toBeDeleted.push(bullets.indexOf(bullet));
			});

			toBeDeleted.forEach(function(index) {
				bullets[index].sprite.destroy();
				delete bullets[index];
			});
		}

		updateBullets() {
			this.bullets.forEach(function(bullet) {
				if(bullet != undefined && !bullet.clean) {
					bullet.update();

					var bullet = bullet;
					Game.game.physics.arcade.collide(bullet.sprite, Global.player.sprite, null, function() {
						bullet.clean = true;
						Global.player.health--;
					}, this);
				}
			});
		}
	}
}
