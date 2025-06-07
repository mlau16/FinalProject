class Victory extends Phaser.Scene{
    constructor(){
        super("victoryScene");
    }

    create(){
        let backdrop = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xFFB6C1).setOrigin(0, 0).setDepth(-11);
        this.add.image(0, 400, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(1.2).setAlpha(0.3);
        this.add.image(1199, 400, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(1.2).setAlpha(0.3);
        this.add.rectangle(0, 646, this.cameras.main.width, 500, 0xE8EBEA).setOrigin(0,0).setDepth(-10).setScrollFactor(0.1).setAlpha(0.4);
        this.add.image(-50, 500, "cloud").setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10).setScale(2).setAlpha(0.8);

        this.add.text(this.cameras.main.centerX,300, "You Win!", {
            fontSize: "100px",
            fontFamily: "'Chewy'",
            color: "#333",
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 390, "Score: " + this.registry.get("score"), {
            fontSize: "45px",
            fontFamily: "'Chewy'",
            color: "#555",
        }).setOrigin(0.5);

        let restartHint = this.add.text(this.cameras.main.centerX, 500, "Press R to Restart", {
            fontSize: "24px",
            fontFamily: "'Chewy'",
            color: "#888"
        }).setOrigin(0.5);

        this.tweens.add({
            targets: restartHint,
            alpha: { from: 0.8, to: 0 },
            duration: 1000,
            yoyo: true,
            repeat: -1, 
            ease: 'Sine.easeInOut'
        });

        this.rKey = this.input.keyboard.addKey("R");

        let backText = this.add.text(720, 800, "Back to Main Menu", {
            fontSize: "24px",
            fontFamily: "'Chewy'",
            color: "#ff8888",
        }).setOrigin(0.5).setInteractive();

        let snore = this.registry.get("snore");

        backText.on('pointerdown', () => {
            snore.stop();
            this.scene.start("mainMenu");
        });
    }

    update(){

        let snore = this.registry.get("snore");

        if(Phaser.Input.Keyboard.JustDown(this.rKey)){
            snore.stop();
            let previousScene = this.registry.get("previousScene");
            this.scene.start(previousScene);

        }
    }
}