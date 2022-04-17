import { Component, OnInit } from '@angular/core';
import { GameControlService } from 'src/app/services/game-control/game-control.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {


  constructor(
    private readonly game: GameControlService
  ) { }

  ngOnInit() {

    this.game.beginGame();
    this.game.loadSprites();
    this.game.loadLevelConfig();

    this.game.createScene();
    // this.game.enableDebug();

  }


  



}


