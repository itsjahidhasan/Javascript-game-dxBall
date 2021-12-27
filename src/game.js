import Paddle from './paddle.js';
import InputHandler from './input.js';
import Ball from './ball.js';
import Brick from './brick.js';
import { buildLevel, level1, level2} from './levels.js';


const GAMESTATE ={
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4
};

export default class Game{
  constructor(gameWidth, gameHeight){
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    this.gamestate = GAMESTATE.MENU;

    this.paddle = new Paddle(this);
    this.ball = new Ball(this);
    this.gameObjects = [];
    this.bricks = [];
    this.lives = 3;
    this.levels = [level1, level2];
    this.currentLevel = 0;
    this.currentLevelRewrite = 1;
    this.ballSpeed = 2;

    new InputHandler(this.paddle, this);
  
  }

  Start(){


    if(this.gamestate !== GAMESTATE.MENU && this.gamestate !== GAMESTATE.NEWLEVEL) return;

    this.bricks = new buildLevel(this, this.levels[this.currentLevel]);

    this.ball.reset(this.ballSpeed);
    this.gameObjects = [this.ball, this.paddle];

    this.gamestate = GAMESTATE.RUNNING;
  }

  update(deltaTime){

    if(this.lives === 0) this.gamestate = GAMESTATE.GAMEOVER;

    if(this.gamestate === GAMESTATE.PAUSED || this.gamestate === GAMESTATE.MENU || this.gamestate === GAMESTATE.GAMEOVER){
      return;
    }
    if(this.bricks.length === 0){

      this.currentLevel++;
      this.currentLevelRewrite++
      this.ballSpeed++;
      this.gamestate = GAMESTATE.NEWLEVEL;
      this.Start();
    }
    else{
    [...this.gameObjects, ...this.bricks].forEach((object) => object.update(deltaTime));

    this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);
    }
  }
  
  draw(ctx){
    [...this.gameObjects, ...this.bricks].forEach((object) => object.draw(ctx));
    
    
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Lives=", 300, 30);
    ctx.fillText(this.lives, 350, 30);
    ctx.fillText("LEVEL=", 470, 30);
    ctx.fillText(this.currentLevelRewrite, 515, 30);


    if(this.gamestate == GAMESTATE.PAUSED){
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      
      ctx.fillText("Game Paused", this.gameWidth / 2, this.gameHeight / 2);
    }
    if(this.gamestate == GAMESTATE.MENU){
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Press Enter to Start", this.gameWidth / 2, this.gameHeight / 2);
    }

    if(this.gamestate == GAMESTATE.GAMEOVER){
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", this.gameWidth / 2, this.gameHeight / 2);
    }
  }

  togglePause(){
    
    if(this.gamestate == GAMESTATE.MENU) return;

    if(this.gamestate == GAMESTATE.PAUSED)
    {
      
      this.gamestate = GAMESTATE.RUNNING;
    }
    else{
      
      this.gamestate = GAMESTATE.PAUSED;
      
    }
  }
}