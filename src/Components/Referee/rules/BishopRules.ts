import { Piece, Position, samePosition, TeamType } from "../../../Constants";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied } from "./GeneralRules";


export const bishopMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean =>{
    // Movement and Attack logic for the bishop

    // Up right movement
    let x: number = desiredPosition.x - initialPosition.x > 0 ? 1 : -1;
    let y: number = desiredPosition.y - initialPosition.y > 0 ? 1 : -1;


    for(let i = 1; i < 8; i++){
        let passedPosition: Position = {x: initialPosition.x + i * x, y: initialPosition.y + i * y};
        // 경로상에 기물이 있는지 확인
        // Check if the passed tile is occupied
        if(samePosition(desiredPosition, passedPosition)){
            // is it occupied by the opponent?
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
