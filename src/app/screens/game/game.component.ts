import { Component, OnInit } from '@angular/core';
import { GameControlService } from 'src/app/services/game-control/game-control.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  from = '';
  body = '';
  show = false;
  hack= false;
  acceptCounter = 0;
  currentMessage = 0;
  saveClicked = false;
  deletePressed=false;

  constructor(
    private readonly game: GameControlService,
  ) { }

  ngOnInit() {
    this.game.showMessage = this.showMessage.bind(this);
    this.game.closeMessage = this.close.bind(this);
    
    document.addEventListener('keydown', e => {
      if (e.key === "Delete") {
        this.game.saveEvent = false;
        this.game.saveClicked = false;
        this.deletePressed = true;
        this.close();
      }
      if(e.key === "Enter"){
        this.save();
      }
    });

    this.game.beginGame();
    this.game.loadSprites();
    this.game.loadSound();

    this.game.createScene();
    // this.game.enableDebug();


  }

  async showMessage({from,text,counter=10, hack}:any){
    this.game.messageCounter++;
    while(this.show){
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    this.currentMessage++;
    this.game.currentMessage = this.currentMessage;
    this.from = from;
    this.body = text;
    this.show = true;
    this.acceptCounter = counter;
    this.deletePressed = false;
    this.startCounter(hack,this.currentMessage);

  }

  async  startCounter ( saveEvent = false, msgCount:number){
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.acceptCounter--;
    if(this.acceptCounter == 0 || this.saveClicked || msgCount !== this.currentMessage){
      if(this.acceptCounter == 0 && msgCount === this.currentMessage){
        this.show = false;
      }
      this.saveClicked = false;
      if(saveEvent){
        this.game.saveClicked = true;
        this.game.saveEvent = true;
        if(!this.deletePressed){
          const coins = parseInt(String(Math.random()*this.game.coins)) || 1;
          this.game.addCoins(-coins);
        }
      } else{
        const coins = parseInt(String(Math.random()*(this.game.chestCapacity - this.game.coins)));
        this.game.addCoins(coins);
      }
    } else {
      this.startCounter(saveEvent , msgCount);
    }
  }

  async close(){
    this.show = false;
    this.game.saveEvent = false;
    this.game.saveClicked = false;
    $('#gameCanvas').focus();
  }

  async save(){
    this.show = false;
    this.saveClicked = true;
    $('#gameCanvas').focus();
  }

  takeToGithub(){
    window.open('https://github.com/solid-droid/CyberDino', "_blank");
  }
}


