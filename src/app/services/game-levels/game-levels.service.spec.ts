import { TestBed } from '@angular/core/testing';

import { GameLevelsService } from './game-levels.service';

describe('GameLevelsService', () => {
  let service: GameLevelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameLevelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
