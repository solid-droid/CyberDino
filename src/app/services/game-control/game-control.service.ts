import { Injectable } from '@angular/core';
declare const kaboom:any;
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class GameControlService {

  game:any;
  player:any;
  SPEED = 500;
  isJumping = false;
  levels = {
    map1 : [
      '                                                           N           ',
      '                                                                       ',
      '                                                                       ',
      '                                                                       ',
      '                                                                       ',
      '                             $ $                                       ',
      '                      B      B B                                       ',
      '                                                                       ',
      '                                                                       ',
      '                                                                       ',
      '                     x                      x    $                     ',
      '=                           =                       =                  ',
     ],
  }

  levelConfig:any = {}


  nextGround:any;
  
  constructor() { 

  }


  beginGame(){
    this.game = kaboom({ 
      global: false,
      font: "sinko",
      canvas: document.querySelector("#gameCanvas"),
      background: [ 240,240,240 ],
   });

   $(window).on('resize',() => {
    this.resize();
    });


  }

  resize(){
    this.player.use(this.game.pos(0, this.game.height()-200));
  }

  loadSprites(){
    this.game.loadSprite("CyberDinoRunRight", './assets/sprites/dino.png', {
      sliceX: 5,
      sliceY:1,
      anims: {
          runRight: {
            from:2,
            to: 3,
            speed: 15,
            loop: true,
          },
          idleRight: 0,
      },
  });

  this.game.loadSprite("CyberDinoRunLeft", './assets/sprites/dinoLeft.png', {
    sliceX: 5,
    sliceY:1,
    anims: {
      runLeft: {
          from:2,
          to: 1,
          speed: 15,
          loop: true,
        },
      idleLeft: 4,
    },
});


  this.game.loadSprite("coin",'./assets/sprites/coin.png',{
    sliceX: 6,
    anims:{
      spin: {
        from:0,
        to: 5,
        speed: 10,
        loop: true,
      },
    }
  });
  this.game.loadSprite("enemy",'./assets/sprites/Enemy.png',{
    sliceX: 2,
    sliceY:1,
    anims: {
      run: {
        from:0,
        to: 1,
        speed: 10,
        loop: true,
      },
    }
  });
  this.game.loadSprite("ground", './assets/sprites/ground.png');
  this.game.loadSprite("block", './assets/sprites/block.png');
  }
  


  loadLevelConfig(){
    this.levelConfig = {
    width:50,
    height:50,
    origin:"bottom",
    pos: this.game.vec2(0, 0),
    '=' : () => [
      this.game.sprite('ground'),
      this.game.origin("top"), 
      this.game.area({ width: 1200, height: 40 }),
      this.game.scale(2),
      this.game.solid(),
      'ground'],
    'B' : () => [
        this.game.sprite('block'),
        this.game.origin("top"), 
        this.game.area({ width: 60, height: 10 }),
        this.game.scale(2),
        this.game.solid(),
     'ground'],
    '$' : () => [
      this.game.sprite('coin'), 
      this.game.origin("topleft"),
      this.game.scale(0.4),
      this.game.area({ width: 110, height: 130 }),
      'coin'],      
    'x' : () => [
      this.game.sprite('enemy'), 
      this.game.origin("top"),
      this.game.scale(3),
      this.game.body(),
      this.game.area({ width: 15, height: 13 }),
      'enemy'],
    'N' : () => [
      this.game.area({ width: 50, height: this.game.height() }),
      'next'
    ]
    };
  
    
  }

  createPlayer(playerPos:any){
    this.player = this.game.add(
      [
      this.game.sprite('CyberDinoRunRight'),
      this.game.pos(playerPos),
      this.game.area({ width: 40, height: 40}),
      this.game.health(8),
      this.game.scale(2),
      this.game.body(),
      "player",
  ]);
    this.nextGround = 1000;
    this.player.onUpdate(() => {

        this.game.camPos(this.game.vec2(this.player.pos.x+this.game.width()/3, (this.player.pos.y * 0.1) + 255));
        if(this.player.isGrounded()){
          this.isJumping = false;
        }

        if(this.player.pos.y > 900){
          this.game.go("game");
        }

        if(this.player.pos.x > this.nextGround ){
          console.log('next');
          this.nextGround += 2400;
          this.createGround(this.nextGround-1000);
        }

    });
  }
  arowControl(){
    //Rigth////////////////////////////////////////////  
    this.game.onKeyDown("right", () => {
      this.player.move(this.SPEED, 0)
      if (this.player.isGrounded() && this.player.curAnim() !== "runRight") {
        this.player.use(this.game.sprite('CyberDinoRunRight'));
        this.player.play("runRight");
      } else if (!this.player.isGrounded() && this.player.curAnim() !== "idleRight") {
        this.player.use(this.game.sprite('CyberDinoRunRight'));
        this.player.play("idleRight");
      }
    });
  
    //Left////////////////////////////////////////////
    this.game.onKeyDown("left", () => {
      if(this.player.pos.x > 50){
       this.player.move(-this.SPEED, 0);
       if (this.player.isGrounded() && this.player.curAnim() !== "runLeft") {
        this.player.use(this.game.sprite('CyberDinoRunLeft'));
        this.player.play("runLeft")
      } else if (!this.player.isGrounded() && this.player.curAnim() !== "idleLeft") {
        this.player.use(this.game.sprite('CyberDinoRunLeft'));
        this.player.play("idleLeft");
      }
      }
   });
   //UP _ SPACE //////////////////////////////////////////////////
    this.game.onKeyPress(["up","space"], () => {
      if (!this.isJumping) {
        this.isJumping = true;
        this.player.jump(900);
        this.player.use(this.game.sprite('CyberDinoRunRight'));
      }

    });
    //////////////////////////////////////////////////////////////
    this.player.onGround(() => {
      if (!this.game.isKeyDown("left") && !this.game.isKeyDown("right")) {
        this.player.use(this.game.sprite('CyberDinoRunRight'));
        this.player.play("idleRight");
      } 

    this.game.onKeyRelease(["left", "right"], () => {
        if (this.player.isGrounded() && !this.game.isKeyDown("left") && !this.game.isKeyDown("right")) {
          this.player.use(this.game.sprite('CyberDinoRunRight'));
          this.player.play("idleRight")
        }
      })
     
    });
  }

  async startAnimations(){
    await this.delay(1000);
    this.game.every('coin', (coin:any) => {
      coin.play('spin');
    });
  }

  enableCollisions(levelId:any){
   
    this.player.onCollide("coin", (coin:any) => {
      coin.destroy();
    });

    this.player.onCollide("enemy", async (enemy:any, collision:any) => {
      this.isJumping = false;
      enemy.destroy();
      if(!collision.isBottom()){
        this.player.color = this.game.rgb(255, 0, 0 );
        this.game.shake(10);
        await this.delay(1000);
        this.player.color = this.game.rgb();
      } else {
   
      }

      
    });

    this.player.onCollide("next", () => {
      // this.game.go("game", {
      //   levelId: levelId < Object.values(this.levels) ? levelId + 1 : 0,
      //   player: this.game.vec2(this.game.width()/2,this.player.pos.y),
      // });   
    });
  }

  delay = async (wait = 1000) => await new Promise(r => setTimeout(r , wait));

  createScene(){
    this.game.scene("game", ({ levelId, player } = { levelId: 0 , player: this.game.vec2(100 , 300) }) => {
        
        // this.game.addLevel(Object.values(this.levels)[levelId ?? 0], this.levelConfig);
        this.createGround();
        this.createPlayer(player);
        this.arowControl();
        this.enableCollisions(levelId);
        this.startAnimations(); 
    });

    

    this.game.go("game");
 
  }

  createGround(x=0){
    this.game.add(
      [
        this.game.sprite('ground'),
        this.game.pos(x, this.game.height() - 200),
        this.game.scale(2),
        this.game.area({ width: 1200, height: 50 }),
        this.game.solid(),
        'ground'
      ]
    );
  }
  enableDebug(status = true){
    this.game.debug.inspect = status;
  }
}
