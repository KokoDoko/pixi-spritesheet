import * as PIXI from "pixi.js"

export class Shark extends PIXI.Sprite {

    hitbox:PIXI.Rectangle

    constructor(texture:PIXI.Texture) {
        super(texture)      
        this.x = -100
        this.y = 180
        this.pivot.set(0.5)

        // de sprite texture is 270 x 135 -- de hitbox is 230 x 95 op positie 20,20
        this.hitbox = new PIXI.Rectangle(40, 40, 190, 55)
        
        // teken de hitbox
        // let greenBox = new PIXI.Graphics()
        // greenBox.lineStyle(2, 0x33FF33, 1)
        // greenBox.drawRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height)
        // this.addChild(greenBox)
    }

    // getbounds geeft nu de hitbox terug in plaats van de afmeting van de sprite
    getBounds() : PIXI.Rectangle {
        return new PIXI.Rectangle(this.x + this.hitbox.x, this.y + this.hitbox.y, this.hitbox.width, this.hitbox.height)
    }

    update(delta: number) {
        //this.x = -2000
        this.x += 2 * delta
        this.y = 200 + Math.sin(this.x / 50) * 30

        if (this.x > window.innerWidth + this.width) this.x = 0 - this.width
    }

}