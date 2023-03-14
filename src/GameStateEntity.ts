import { Observable, Subject, BehaviorSubject, of } from 'rxjs';

export enum GameState {
    START_MENU,
    GAME,
    PAUSE,
    WIN,
    GAME_OVER,
    RETRY,
    EXIT
}

export class GameStateEntity {
    public subjectGameState: Subject<GameState> = new BehaviorSubject(null);

    constructor() {
        this.subjectGameState.next(GameState.START_MENU);
    }
}