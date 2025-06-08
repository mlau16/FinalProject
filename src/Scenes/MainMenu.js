class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenu");
    }

    create() {
        //Background movement
        this.cameras.main.setBounds(0, 0, 2000, 600);
        this.tweens.add({
        targets: this.cameras.main,
        scrollX: 400,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
        }); 

        //Background Elements
        let backdrop = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xFFFFFF).setOrigin(0, 0).setScrollFactor(0).setDepth(-11);
        let sky = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x41609e, 0.9).setOrigin(0, 0).setScrollFactor(0).setDepth(-11);

        this.backgroundPlayer = this.add.sprite(100, 300, "platformer_characters", "tile_0006.png");
        this.backgroundPlayer.setScale(2);  
        this.backgroundPlayer.setAlpha(1); 
        this.backgroundPlayer.setScrollFactor(0);

        this.tweens.add({
            targets: this.backgroundPlayer,
            y: '+=200',          
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.backgroundPlayer,
            x: '+=1200',         
            duration: 10000,     
            yoyo: true,         
            repeat: -1,       
            ease: 'Sine.easeInOut'
        });

        this.add.image(0, 615, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(1.2).setAlpha(0.3);
        this.add.image(1199, 615, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(1.2).setAlpha(0.3);
        this.add.rectangle(0, 861, this.cameras.main.width, 100, 0xFFFFFF).setOrigin(0,0).setDepth(-10).setScrollFactor(0.1).setAlpha(0.3);
        this.add.image(-50, 600, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(2).setAlpha(0.8);

        this.add.image(0, 800, "hills").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-9);
        this.add.image(1000, 800, "hills").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-9);

        this.add.image(150, 720, "tree1").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-8).setScale(0.4);
        this.add.image(300, 780, "tree1").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-8).setScale(0.3);
        this.add.image(1050, 750, "tree1").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-8).setScale(0.2);
        this.add.image(1100, 730, "tree1").setOrigin(0, 0).setScrollFactor(0.3).setDepth(-8).setScale(0.3);

        // Add title text
        this.add.text(720, 300, "Napstronaut", {
            fontSize: "72px",
            fontFamily: "'Chewy'",
            color: "#ffffff",
        }).setOrigin(0.5).setScrollFactor(0);

        // Start Game button 
        let startText = this.add.text(480, 500, "Select Level", {
            fontSize: "32px",
            fontFamily: "'Chewy'",
            color: "#f2ecb1",
        }).setOrigin(0.5).setInteractive().setScrollFactor(0);


        startText.on('pointerover', () => {
            this.sound.play("rollover");
            startText.setAlpha(0.5);
        });
        startText.on('pointerout', () => {
            startText.setAlpha(1);
        });

        startText.on('pointerdown', () => {
            this.sound.play("select");
            this.scene.start("levelSelect"); 
        });

        // Credits Button
        let creditsText = this.add.text(960, 500, "Credits", {
            fontSize: "32px",
            fontFamily: "'Chewy'",
            color: "#f2ecb1",
        }).setOrigin(0.5).setInteractive().setScrollFactor(0);
      
        creditsText.on('pointerover', () => {
            this.sound.play("rollover");
            creditsText.setAlpha(0.5);
        });
        creditsText.on('pointerout', () => {
            creditsText.setAlpha(1);
        });

        creditsText.on('pointerdown', () => {
            this.sound.play("select");
            this.scene.start("creditsScene"); 
        });
    }
}
