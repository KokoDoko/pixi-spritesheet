import * as PIXI from "pixi.js"
import fishImage from "./images/fish.png"
import bonesImage from "./images/bones.png"
import waterImage from "./images/tilingwater.png"
import monitorImage from "./images/wave.png"
import scanImage from "./images/scanlines.png"
import sharkImage from "./images/shark.png"
import dispImage from "./images/displacement_map.jpg"
import catSheetImage from "./images/cattest.png"
import { Fish } from "./Fish"
import { Shark } from "./Shark"
import { EvilFish } from "./EvilFish"
import { Explosion } from "./Explosion"

export class Game {

    pixi: PIXI.Application
    sprites : (Fish | EvilFish)[] = []
    explosionTextures:PIXI.Texture[] = []
    catTextures: PIXI.Texture[] = []
    shark : Shark
    displacementSprite:PIXI.Sprite
    container:PIXI.Container

    constructor() {

        this.pixi = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight })
        document.body.appendChild(this.pixi.view)

        // image preloader
        this.pixi.loader
            .add("fish", fishImage)
            .add("bones", bonesImage)
            .add("shark", sharkImage)
            .add("watertexture", waterImage)
            .add("dispTexture", dispImage)
            .add("monitorMap", monitorImage)
            .add("scanTexture", scanImage)
            .add("spritesheet", "explosion.json")
            // .add("cat-sheet", "cat-sheet.json")
        
        this.pixi.loader.onProgress.add((p:PIXI.Loader) => this.showProgress(p))
        this.pixi.loader.onComplete.add(() => this.doneLoading())
        this.pixi.loader.load()
    }

    showProgress(p:PIXI.Loader){
        console.log(p.progress)
    }

    doneLoading(){        
        this.createExplosionFrames()
        this.createScene()

        this.createDisplacementFilter()
    }



    createDisplacementFilter() {

        // color matrix filter
        //const colorFilter = new PIXI.filters.ColorMatrixFilter()
        //colorFilter.hue(Math.random() * 360, true)
        //colorFilter.night(1, true)
        //this.pixi.stage.filters = [colorFilter]

        // water displacement filter
        this.displacementSprite = PIXI.Sprite.from(this.pixi.loader.resources["dispTexture"].texture!);
        this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        const displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
        displacementFilter.padding = 10;
        this.pixi.stage.addChild(this.displacementSprite)
        this.pixi.stage.filters = [displacementFilter]
        displacementFilter.scale.x = 30
        displacementFilter.scale.y = 60

        // monitor displacement filter on the container, not on the stage
        // this.displacementSprite = PIXI.Sprite.from(this.pixi.loader.resources["monitorMap"].texture!);
        // this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        // const displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
        // this.container.addChild(this.displacementSprite)
        // this.container.filters = [displacementFilter]
        // displacementFilter.scale.y = 40

        this.pixi.ticker.add((delta) => this.update(delta))
    }

    // createCatFrames(){
    //     for (let i = 1; i < 38; i++) {
    //         const texture = PIXI.Texture.from(`poes_${i}.png`)
    //         this.catTextures.push(texture)
    //     }
    // }

    createExplosionFrames() {
        for (let i = 0; i < 26; i++) {
            const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`)
            this.explosionTextures.push(texture)
        }
    }

    createExplosion(x:number, y:number){
        const explosion = new Explosion(this.explosionTextures, x, y)
        this.pixi.stage.addChild(explosion)
    }    

    createScene(){
        // put all sprites and background into a container
        // so we can put a displacement filter on the container. and put a scanlines filter over that.
        this.container = new PIXI.Container()
        this.pixi.stage.addChild(this.container)

        let bg = new PIXI.TilingSprite(this.pixi.loader.resources["watertexture"].texture!, window.innerWidth, window.innerHeight)
        this.container.addChild(bg)

        for(let i = 0; i < 20; i++){
            let fish = new Fish(this)
            this.container.addChild(fish)
            this.sprites.push(fish)
        }

        this.shark = new Shark(this.pixi.loader.resources["shark"].texture!)
        this.container.addChild(this.shark)

        let evilFish = new EvilFish(this)
        this.container.addChild(evilFish)
        this.sprites.push(evilFish)

        // scanlines outside container
        // let scans = new PIXI.TilingSprite(this.pixi.loader.resources["scanTexture"].texture!, 1200, 700)
        // this.pixi.stage.addChild(scans)
        // scans.blendMode = PIXI.BLEND_MODES.MULTIPLY
        // scans.alpha = 0.2
    }

    update(delta:number) {
        //this.displacementSprite.x+=3
        //if (this.displacementSprite.x > this.displacementSprite.width) { this.displacementSprite.x = 0 }
        this.displacementSprite.y -= 2
        if (this.displacementSprite.y < -this.displacementSprite.height) { this.displacementSprite.y = 0 }


        this.shark.update(delta)
        for(let s of this.sprites) {
            s.update(delta)
        }
        this.checkCollisions()
    }

    private checkCollisions() {
        for (let fish of this.sprites) {
            if (this.collision(this.shark, fish)) {
                fish.hitShark()
            }
        }
    }

    private collision(sprite1: PIXI.Sprite, sprite2: PIXI.Sprite) {
        const bounds1 = sprite1.getBounds()
        const bounds2 = sprite2.getBounds()

        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y
    }
}

new Game()