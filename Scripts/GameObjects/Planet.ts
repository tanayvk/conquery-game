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

			this.progressBar = new GameObjects.ProgressBar(Game.game.width / 2 - 100, Game.game.height - 100, 200, 30, 50);
			this.progressBar.setColors("#eeeeee", "#2233bb", "#ff1111");
			this.progressBar.showText = true;

			this.bullets = new Array<GameObjects.Bullet>();
			this.bulletSpeed = 1000;
			this.maxBullets = this.numOfBullets = 3;

			Game.game.time.events.loop(Phaser.Timer.SECOND / 3, this.giveBullet, this);
		}

		update() {
			if(!this.isActivated && this.actionKey.isDown && Game.game.physics.arcade.overlap(this.sprite, Global.player.sprite)) {
				if(this.loadTimer.seconds == 0)
					this.loadTimer.start();
				else
					this.loadTimer.resume();

				this.progressBar.text = "Capturing...";
			} else if(!this.isActivated) {
				this.progressBar.text = "Hold space to capture planet.";
				this.loadTimer.pause();
			}

			if(this.isActivated) {
				var planet = this;
				Global.enemies.forEach(function(enemy) {
					if(planet.canSeeEnemy(enemy) && planet.numOfBullets > 0) {
						planet.Shoot(enemy);
						planet.numOfBullets--;
					}
				});
			}
			this.cleanBulletsArray();
			this.bullets.forEach(function(bullet) {
				// if(bullet.sprite.body != null) {
					var bul = bullet;
					bullet.update();

					Global.enemies.forEach(function(enemy) {
						if(Game.game.physics.arcade.overlap(enemy.sprite, bul.sprite)) {
							bul.clean = true;
							enemy.health = enemy.health - 5;
						}
					});
				// }
			});
		}

		render() {
			if (!this.isActivated && Game.game.physics.arcade.overlap(this.sprite, Global.player.sprite)) {
				this.progressBar.percent = (this.loadTimer.seconds / this.loadTime) * 100;
				this.progressBar.draw();
			}
		}

		activatePlanet() {
			this.isActivated = true;
			this.loadTimer.destroy();
			delete this.loadTimer;

			delete this.progressBar;

			this.sprite.loadTexture('planet_activated');
		}

		canSeeEnemy(enemy) {
			var myCoords = new Phaser.Point(this.sprite.x, this.sprite.y);
			var enemyCoords = new Phaser.Point(enemy.sprite.x, enemy.sprite.y);

			var photon = new GameObjects.Photon(myCoords, enemyCoords, Global.blockedLayer);
			return photon.isFree();
		}

		Shoot(enemy) {
			var bullet = new GameObjects.Bullet(this.sprite.x, this.sprite.y, this.bulletSpeed);
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

		cleanBulletsArray() {
			var bullets = this.bullets;
			var newBullets = new Array<GameObjects.Bullet>();
			this.bullets.forEach(function(bullet) {
				if(bullet.clean && bullet.sprite != undefined)
				{
					bullet.sprite.destroy();
				} else if(bullet.sprite != undefined) {
					newBullets.push(bullet);
				}
			});

			delete this.bullets;
			this.bullets = newBullets;
		}
	}
}
