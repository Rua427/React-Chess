import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied } from "./GeneralRules";

 
export const rookMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {

    // Movement and Attack logic for the rook

    // Up right movement
    let x: number = desiredPosition.x - initialPosition.x;
    let y: number = desiredPosition.y - initialPosition.y;

    if (x !== 0 && y !== 0){
        return false;
    }

    if(x === 0){
        y = y > 0 ? 1 : -1;
    }
    else if(y === 0){
        x = x > 0 ? 1 : -1;
    }

    for(let i = 1; i < 8; i++){
        let passedPosition = new Position(initialPosition.x + (i * x), initialPosition.y + (i * y));
        // 경로상에 기물이 있는지 확인
        // Check if the passed tile is occupied
        if(passedPosition.samePosition(desiredPosition)){
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

export const GetPossibleRookMoves = (rook: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];

    for (let i = 1; i < 8; i++) {
        const destination = new Position(rook.position.x, rook.position.y + i);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, rook.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 8; i++) {
        const destination = new Position(rook.position.x + i, rook.position.y);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, rook.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 8; i++) {
        const destination = new Position(rook.position.x, rook.position.y - i);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, rook.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 8; i++) {
        const destination = new Position(rook.position.x - i, rook.position.y);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, rook.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    return possibleMoves;
}
