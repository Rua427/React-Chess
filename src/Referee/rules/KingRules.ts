import {  samePosition, TeamType } from "../../Constants";
import { Piece, Position } from "../../models";
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

    let passedPosition = new Position(initialPosition.x + x, initialPosition.y + y);
    
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

export const GetPossibleKingMoves = (king: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];

    for (let i = 1; i < 2; i++) {
        const destination = new Position(king.position.x, king.position.y + i);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 2; i++) {
        const destination = new Position(king.position.x + i, king.position.y);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 2; i++) {
        const destination = new Position(king.position.x, king.position.y - i);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for (let i = 1; i < 2; i++) {
        const destination = new Position(king.position.x - i, king.position.y);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x + i, king.position.y + i);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x - i, king.position.y + i);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x + i, king.position.y - i);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x - i, king.position.y - i);

        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsEmptyOrOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    return possibleMoves;
}