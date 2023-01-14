import { Piece, Position, samePosition, TeamType } from "../../../Constants";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied } from "./GeneralRules";

export const kingMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    //Top
    let x: number = desiredPosition.x - initialPosition.x;
    let y: number = desiredPosition.y - initialPosition.y;

    if(x !== 0){
        x = x > 0 ? 1 : -1;
    }
    if(y !== 0){
        y = y > 0 ? 1 : -1;
    }

    let passedPosition: Position = {x: initialPosition.x + x, y: initialPosition.y + y};
    
    if(samePosition(desiredPosition, passedPosition)){
        if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
            return true;
        }
    }
    else if(tileIsOccupied(passedPosition, boardState)){
        return false;
    }

    return false;
}