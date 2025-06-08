class Level3_2 extends Phaser.Scene {
    constructor() {
        super("level3_2");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 1000;
        this.DRAG = 600;   
        this.physics.world.gravity.y = 1400;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.PLAYERSCORE = 0;
        this.die = false;
        this.jumpCount = 0;
        this.maxJumps = 2;
        this.sceneChanging = false;
    }

    create() {
        // Background audio
        this.bgm = this.sound.add('music', {
            loop: true,
            volume: 0.5
        });

        this.registry.set("snore", this.sound.add("snoring", { loop: true}));

        // Backdrop
        let backdrop = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xc7ced6).setOrigin(0, 0).setScrollFactor(0).setDepth(-11);
     
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 90 tiles wide and 40 tiles tall.
        this.map = this.add.tilemap("Festive_Farms2", 18, 18, 60, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.kennyTileset = this.map.addTilesetImage("kenny_tilemap_packed", "kenny_tilemap_tiles");
        this.farmTileset = this.map.addTilesetImage("farm_tilemap_packed", "farm_tilemap_tiles");

        // Create a layer
        this.layer1 = this.map.createLayer("Layer1", this.farmTileset, 0, 0);

        // Make it collidable
        this.layer1.setCollisionByProperty({
            collides: true
        });

        // Create Objects 
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "kenny_tilemap_sheet",
            frame: 151
        });

        this.bed = this.map.createFromObjects("Objects", {
            name: "bed",
            key: "bed_tilemap_sheet",
            frame: 0,
            y: 90
        });

        // Add physics
        this.physics.world.enable(this.bed, Phaser.Physics.Arcade.STATIC_BODY);
        this.bedGroup = this.add.group(this.bed);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 100);
        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        let spawnPoint = this.map.findObject("Objects", obj => obj.name === "PlayerSpawn");

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "platformer_characters", "tile_0006.png");
        my.sprite.player.setCollideWorldBounds(true);

        my.sprite.player.setMaxVelocity(300, 700); 


        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.layer1);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');
        this.vKey = this.input.keyboard.addKey('V');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // movement vfx

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            // TODO: Try: add random: true
            random:true,
            scale: {start: 0.03, end: 0.05},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 4,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 0.5, end: 0.1}, 
        });

        my.vfx.walking.stop();

        this.physics.add.overlap(my.sprite.player, this.coinGroup, (player, coin) => {
            my.vfx.coin.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.coin.emitParticleAt(coin.x, coin.y, 15);
            this.sound.play("clink");
            this.PLAYERSCORE += 10;
            this.scoreText.setText("Score: " + this.PLAYERSCORE);
            coin.destroy(); 
        });

        this.coins.forEach(coin => {
            coin.anims.play('spin');
        });

        my.vfx.coin = this.add.particles(0, 0, "kenny-particles", {
            frame: ['star_01.png', 'star_03.png'],
            scale: {start: 0.03, end: 0.25},
            maxAliveParticles: 4,
            lifespan: 350,
            gravityY: -100,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.coin.stop();

        // Camera Settings
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); 
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE * 1.5);

        // Score
        this.scoreText = this.add.text(490, 310, "Score: " + this.registry.get("score"), {
            fontFamily: "'Chewy",
            fontSize: '10px',
            fill: '#ffffff'
        }).setScrollFactor(0);

        // Checks for winning condition
        this.physics.add.overlap(my.sprite.player, this.bedGroup, this.onBedOverlap, null, this);

        // Drop menu
        this.menu = this.add.container(this.scale.width / 2, this.scale.height / 2); 
    
        let bg = this.add.rectangle(0, 0, 350, 250, 0x000000, 0.8);
        bg.setOrigin(0.5).setScrollFactor(0);

        let menuText = this.add.text(0, -70, 'Paused', { fontSize: '32px', color: '#ffffff', fontFamily: "'Chewy'"}).setOrigin(0.5).setScrollFactor(0);
        let resumeText = this.add.text(0, -40, 'Click (ESC) to Resume', { fontSize: '16px', color: '#ffffff', fontFamily: "'Chewy'" }).setOrigin(0.5).setScrollFactor(0);

        let restartButton = this.add.text(0, 0, 'Restart Level', { fontSize: '24px', color: '#ffaaaa', fontFamily: "'Chewy'" }).setOrigin(0.5);
        restartButton.setScrollFactor(0).setInteractive({ useHandCursor: true });

        restartButton.on('pointerdown', () => {
            this.sound.play("select");
            this.bgm.stop();
            this.scene.stop();         
            this.scene.start("level3_1"); 
        });

        restartButton.on('pointerover', () => {
            this.sound.play("rollover");
            restartButton.setAlpha(0.5);
        });
        restartButton.on('pointerout', () => {
            restartButton.setAlpha(1);
        });

        let backButton = this.add.text(0, 60, 'Back to Main Menu', { fontSize: '24px', color: '#ffaaaa', fontFamily: "'Chewy'" }).setOrigin(0.5);
        backButton.setScrollFactor(0).setInteractive({ useHandCursor: true });

        backButton.on('pointerdown', () => {
            this.sound.play("select");
            this.bgm.stop();
            this.scene.stop();         
            this.scene.start('mainMenu'); 
        });

        backButton.on('pointerover', () => {
            this.sound.play("rollover");
            backButton.setAlpha(0.5);
        });
        backButton.on('pointerout', () => {
            backButton.setAlpha(1);
        });

        let levelButton = this.add.text(0, 30, 'Level Select', { fontSize: '24px', color: '#ffaaaa', fontFamily: "'Chewy'" }).setOrigin(0.5);
        levelButton.setScrollFactor(0).setInteractive({ useHandCursor: true });

        levelButton.on('pointerdown', () => {
            this.sound.play("select");
            this.bgm.stop();
            this.scene.stop();         
            this.scene.start('levelSelect'); 
        });

        levelButton.on('pointerover', () => {
            this.sound.play("rollover");
            levelButton.setAlpha(0.5);
        });
        levelButton.on('pointerout', () => {
            levelButton.setAlpha(1);
        });

        this.menu.add([bg, menuText, resumeText, backButton, levelButton, restartButton]);
        this.menu.setScale(0.66666);
        this.menu.setVisible(false);

        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.menuVisible = false;

    }

    update() {
        
            // Left/right movement
            if(cursors.left.isDown) {
                my.sprite.player.setAccelerationX(-this.ACCELERATION);
                my.sprite.player.resetFlip();
                my.sprite.player.anims.play('walk', true);
                if (my.sprite.player.body.blocked.down) {
                    my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
                    my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                    my.vfx.walking.start();
                }
            } else if(cursors.right.isDown) {
                my.sprite.player.setAccelerationX(this.ACCELERATION);
                my.sprite.player.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);
                if (my.sprite.player.body.blocked.down) {
                    my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
                    my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                    my.vfx.walking.start();
                }
            } else {
                my.sprite.player.setAccelerationX(0);
                my.sprite.player.setDragX(this.DRAG);
                my.sprite.player.anims.play('idle');
                my.vfx.walking.stop();
            }

            // Jump
            if(!my.sprite.player.body.blocked.down) {
                my.sprite.player.anims.play('jump');
            }

            if (my.sprite.player.body.blocked.down) {
                this.jumpCount = 0;
                this.jumpReleased = true;  
            }
    
            if (!cursors.up.isDown) {
                this.jumpReleased = true;
            }

            // Double jump
            if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpCount === 0) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.sound.play("jump");
                this.jumpCount++;
                this.jumpReleased = false;
            } else if (cursors.up.isDown && this.jumpCount === 1 && this.jumpReleased) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.sound.play("jump");
                this.jumpCount++;
                this.jumpReleased = false;
            }
            
            // Set max speed
            let maxSpeed = 250;  

            if (my.sprite.player.body.velocity.x > maxSpeed) {
                my.sprite.player.body.velocity.x = maxSpeed;
            }
            if (my.sprite.player.body.velocity.x < -maxSpeed) {
                my.sprite.player.body.velocity.x = -maxSpeed;
            }

            // Drop menu pauses game
            if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
                this.menuVisible = !this.menuVisible;
                this.menu.setVisible(this.menuVisible);
            
                if (this.menuVisible) {
                    this.physics.world.pause(); 
                } else {
                    this.physics.world.resume();
                }
            }
    }

    //When player wins
    onBedOverlap(player, bed) {
        console.log("Bed overlaped");
        if (this.sceneChanging) return;
        this.sceneChanging = true;
        let bgm = this.registry.get("bgm");
    
        this.tweens.add({
            targets: bgm,
            volume: 0,
            duration: 1000,
            onComplete: () => {
                bgm.stop();
            }
        });
    
        this.registry.get("snore").play();
    
        this.time.delayedCall(1000, () => {
            this.cameras.main.fadeOut(800, 0, 0, 0);
    
            this.cameras.main.once('camerafadeoutcomplete', () => {
                console.log("FADE OUT COMPLETE! Switching to victoryScene...");
                this.registry.set("score", this.PLAYERSCORE);
                this.scene.start("victoryScene");
            });
        });
    }
    
    
}