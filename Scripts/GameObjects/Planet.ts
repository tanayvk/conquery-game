module GameObjects {
	export class Planet {
		isActivated: boolean
		sprite: Phaser.Sprite

		actionKey: Phaser.Key;

		loadTime;
		loadTimer;

		progressBar;

		bullets: Array<GameObjects.Bullet>;
		bulletSpeed: number;
		numOfBullets: number;
		maxBullets: number;

		enemiesArray;

		constructor(x, y) {
			this.isActivated = false;

			this.sprite = Game.game.add.sprite(x, y, 'planet');
			this.sprite.anchor.setTo(0.5, 0.5);
			Game.game.physics.arcade.enable(this.sprite);

			this.actionKey = Game.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

			this.loadTime = 3;

			this.loadTimer = Game.game.time.create(false);
			this.loadTimer.add(this.loadTime * Phaser.Timer.SECOND, this.activatePlanet, this);
			this.loadTimer.start();
			this.loadTimer.pause();

			this.progressBar = new GameObjects.ProgressBar(Game.game.width / 2 - 100, Game.game.height - 100, 200, 30, 50);

			this.bullets = new Array<GameObjects.Bullet>();
			this.bulletSpeed = 30;
			this.maxBullets = this.numOfBullets = 3;

			Game.game.time.events.loop(Phaser.Timer.SECOND / 3, this.giveBullet, this);
		}

		update() {
			if(!this.isActivated && this.actionKey.isDown && Game.game.physics.arcade.collide(this.sprite, Global.player.sprite)) {
				this.loadTimer.resume();
			} else {
				this.loadTimer.pause();
			}

			var planet = this;
			if(this.isActivated) {
				Global.enemies.forEach(function(enemy) {
					if(planet.canSeeEnemy(enemy) && planet.numOfBullets > 0) {
						planet.Shoot(enemy);
						planet.numOfBullets--;
					}
				});
			}

			this.bullets.forEach(function(bullet) {
				bullet.update();
				Global.bullet = bullet;
				Game.game.physics.arcade.collide(Global.bullet.sprite, planet.getEnemiesArray(), null, function() {
					Global.bullet.sprite.destroy();
					Global.bullet = null;
				}, this);
			});
		}

		render() {
			if (Game.game.physics.arcade.collide(this.sprite, Global.player.sprite) && !this.isActivated) {
				this.progressBar.percent = (this.loadTimer.seconds / this.loadTime) * 100;
				this.progressBar.draw();
			}
		}

		activatePlanet() {
			this.isActivated = true;
			this.loadTimer.destroy();

			this.sprite.loadTexture('planet_activated');
		}

		canSeeEnemy(enemy) {
			var myCoords = new Phaser.Point(this.sprite.x, this.sprite.y);
			var enemyCoords = new Phaser.Point(enemy.sprite.x, enemy.sprite.y);

			var photon = new GameObjects.Photon(myCoords, enemyCoords, Global.blockedLayer);
			return photon.isFree();
		}

		Shoot(enemy) {
			var bullet = new GameObjects.Bullet(this.sprite.x, this.sprite.y, 0, this.bulletSpeed);
			bullet.towards(enemy.sprite.x, enemy.sprite.y);
			this.bullets.push(bullet);
		}

		getEnemiesArray() {
			if(this.enemiesArray == undefined) {
				this.enemiesArray = new Array<Phaser.Sprite>();

				var planet = this;
				Global.enemies.forEach(function(enemy) {
					planet.enemiesArray.push(enemy.sprite);
				});
			}

			return this.enemiesArray;
		}

		giveBullet() {
			if(this.numOfBullets != this.maxBullets)
				this.numOfBullets++;
		}
	}
}
