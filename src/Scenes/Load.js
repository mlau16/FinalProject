class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");
        
        // Load tilemap information
        this.load.image("kenny_tilemap_tiles", "kenny_tilemap_packed.png");                         
        this.load.image("food_tilemap_tiles", "food_tilemap_packed.png");
        this.load.image("industrial_tilemap_packed", "industrial_tilemap_packed.png");
        this.load.image("farm_tilemap_tiles", "farm_tilemap_packed.png");
        this.load.image("victory_bed", "pixel_bed.png");

        //Background elements
        this.load.image("cloud", "clouds1.png");
        this.load.image("hills", "hills1.png");
        this.load.image("tree1", "tree01.png");
        this.load.image("tree2", "tree04.png");
        this.load.image("sky", "sky.png");

        //Buttons
        this.load.image("donut", "tile_0014.png");
        this.load.image("barrel", "tile_0010.png");
        this.load.image("pumpkin", "tile_0004.png");


        this.load.tilemapTiledJSON("Crumbly_Cliffs", "Crumbly_Cliffs.tmj");
        this.load.tilemapTiledJSON("Metal_Mayhem", "Metal_Mayhem.tmj");
        this.load.tilemapTiledJSON("Festive_Farms", "Festive_Farms.tmj");
        this.load.tilemapTiledJSON("Festive_Farms2", "Festive_Farms2.tmj");

        // Load the tilemap as a spritesheet
        this.load.spritesheet("kenny_tilemap_sheet", "kenny_tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("food_tilemap_sheet", "food_tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet("industrial_tilemap_sheet", "industrial_tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet("farm_tilemap_sheet", "farm_tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet("bed_tilemap_sheet", "pixel_bed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        this.load.audio("jump", "phaseJump1.ogg");
        this.load.audio("clink", "coin.mp3" ); 
        this.load.audio("music", "game_music.mp3"); //Game Music Loop 7 by XtremeFreddy
        this.load.audio("death", "pixel_death.mp3"); //Pixel Explosion by Lumora_Studios
        this.load.audio("snoring", "snoring.mp3");
        this.load.audio("acidBurn", "acidBurn.mp3"); //Acid burn, sizzle 14 by Zapsplat

    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 6,
                end: 7,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0006.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0007.png" }
            ],
        });

        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('kenny_tilemap_sheet', {
                start: 151,
                end: 152
            }),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'open',
            frames: this.anims.generateFrameNumbers('industrial_tilemap_sheet', {
                start: 28,
                end: 44
            }),
            frameRate: 10,
            repeat: 0
        });

         // ...and pass to the next Scene
         this.scene.start("mainMenu");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}