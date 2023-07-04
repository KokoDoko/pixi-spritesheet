import { Game } from "./Game"
import * as PIXI from "pixi.js"

export class Fish extends PIXI.Sprite {
    
    bonesTexture : PIXI.Texture
    dead:boolean = false
    game:Game
    speed:number
    clickHandler:EventListener

    constructor(game: Game) {
        super(game.pixi.loader.resources["fish"].texture!)
        this.bonesTexture = game.pixi.loader.resources["bones"].texture!
        this.game = game
        this.speed = Math.random() * 3
        this.scale.set(0.4 + (Math.random() * 0.8))
        this.pivot.set(0.5)
        this.x = Math.random() * game.pixi.screen.width + 200
        this.y = Math.random() * game.pixi.screen.height
        this.buttonMode = true
        this.interactive = true
        this.clickHandler = () => this.onClick()
        this.on('pointerdown', this.clickHandler)

        // color matrix filter
        const filter = new PIXI.filters.ColorMatrixFilter()
        filter.hue(Math.random()*360, false)
        this.filters = [filter]


        // teken een groene box
        // let area = this.getBounds()
        // let greenBox = new PIXI.Graphics()
        // greenBox.lineStyle(2, 0x33FF33, 1)
        // greenBox.drawRect(0, 0, area.width, area.height)
        // this.addChild(greenBox)
    }

    onClick() {
        console.log("clicked a fish")
        this.game.createExplosion(this.x, this.y)
        this.off('pointerdown', this.clickHandler)
        this.texture = this.bonesTexture
        this.dead = true
    }

    hitShark() {
        //this.alpha = 0.7
        this.texture = this.bonesTexture
        this.dead = true
    }
    

    update(delta : number) {
        if(!this.dead) {
            this.x -= this.speed * delta
            this.y += Math.sin(this.x / 50)
        } else {
            if(this.y < window.innerHeight) this.y += Math.random()
        }

        if(this.x < -100) {
            this.y = Math.random() * 800
            this.x = window.innerWidth + 100
        }
    }

}