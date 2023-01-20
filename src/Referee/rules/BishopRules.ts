import { samePosition, TeamType } from "../../Constants";
import { Piece, Position } from "../../models";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied } from "./GeneralRules";


export const bishopMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean =>{
    // Movement and Attack logic for the bishop

    // Up right movement
    let x: number = desiredPosition.x - initialPosition.x > 0 ? 1 : -1;
    let y: number = desiredPosition.y - initialPosition.y > 0 ? 1 : -1;


    for(let i = 1; i < 8; i++){
        let passedPosition = new Position(initialPosition.x + i * x, initialPosition.y + i * y);
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


export const GetPossibleBishopMoves = (bishop: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];

    for(let i = 1; i < 8; i++){
        const destination = new Position( bishop.position.x + i, bishop.position.y + i);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, bishop.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination = new Position(bishop.position.x - i, bishop.position.y + i);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, bishop.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination = new Position(bishop.position.x + i, bishop.position.y - i);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, bishop.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination = new Position(bishop.position.x - i, bishop.position.y - i);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, bishop.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    return possibleMoves;
}