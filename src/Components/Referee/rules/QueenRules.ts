import { Piece, Position, samePosition, TeamType } from "../../../Constants";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied } from "./GeneralRules";

export const queenMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    //Top
    let x: number = desiredPosition.x - initialPosition.x;
    let y: number = desiredPosition.y - initialPosition.y;

    if(x !== 0){
        x = x > 0 ? 1 : -1;
    }
    if(y !== 0){
        y = y > 0 ? 1 : -1;
    }

    for (let i = 1; i < 8; i++) {
        let passedPosition: Position = {x: initialPosition.x + (i * x), y: initialPosition.y + (i * y)};
        
        if(samePosition(desiredPosition, passedPosition)){
            if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                return true;
            }
        }
        else if(tileIsOccupied(passedPosition, boardState)){
            break;
        }
    }

    return false;
}