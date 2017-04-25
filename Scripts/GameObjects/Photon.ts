/// <reference path="../3rdParty/phaser.d.ts" />
/// <reference path="../app.ts" />

module GameObjects {
	export class Photon {
		p1: Phaser.Point;
		p2: Phaser.Point;
		collisionLayer;
		line;
		constructor (p1, p2, collisionLayer) {
			this.p1 = p1;
			this.p2 = p2;
			this.collisionLayer = collisionLayer;
		}

		calculate() {
			this.line = new Phaser.Line();
			this.line.start.set(this.p1.x, this.p1.y);
			this.line.end.set(this.p2.x, this.p2.y);

			// if(this.line.width > 750)
			// 	return false;

			var tileHits = this.collisionLayer.getRayCastTiles(this.line, 8, true, true);
			if (tileHits.length > 0) {
				if(Global.debug == true)
					for (var i = 0; i < tileHits.length; i++)
			        {
			            tileHits[i].destroy();
			        }
				return false;
			}

			return true;
		}

		isFree() {
			return this.calculate();
		}
	}
}
