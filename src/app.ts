import "phaser";
import { WelcomeScene } from "./welcomeScene";
import { GameScene } from "./gameScene";
import { ScoreScene } from "./scoreScene";

const config: GameConfig = {
  title: "Space Gari",
  width: window.innerWidth * window.devicePixelRatio, 
  height: window.innerHeight * window.devicePixelRatio,
  parent: "game",
  scene: [WelcomeScene, GameScene, ScoreScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  backgroundColor: "#18216D"
};

export class SpaceGariGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
};

window.onload = () => {
  var game = new SpaceGariGame(config);
};
