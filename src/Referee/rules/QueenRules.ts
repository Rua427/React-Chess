import { Piece, Position, samePosition, TeamType } from "../../Constants";
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


export const GetPossibleQueenMoves = (queen: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];

    for (let i = 1; i < 8; i++) {
        const destination: Position = {x: queen.position.x, y: queen.position.y + i};

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, queen.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 8; i++) {
        const destination: Position = {x: queen.position.x + i, y: queen.position.y};

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, queen.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 8; i++) {
        const destination: Position = {x: queen.position.x, y: queen.position.y - i};

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, queen.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 8; i++) {
        const destination: Position = {x: queen.position.x - i, y: queen.position.y};

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, queen.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: queen.position.x + i, y: queen.position.y + i};

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, queen.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: queen.position.x - i, y: queen.position.y + i};

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, queen.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: queen.position.x + i, y: queen.position.y - i};

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, queen.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: queen.position.x - i, y: queen.position.y - i};

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, queen.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    return possibleMoves;
}