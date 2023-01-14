
import {PieceType, TeamType, Piece, Position, samePosition} from '../../Constants'

export default class Referee {
    tileIsEmptyOrOccupiedByOpponent(
        position: Position,
        boardState: Piece[],
        team: TeamType,
    ){
        return !this.tileIsOccupied(position, boardState) || this.TileIsOccupiedByOpponent(position, boardState, team);
    }
    tileIsOccupied(position: Position, boardState: Piece[]): boolean{
        const piece = boardState.find(p => samePosition(p.position, position))

        if(piece){
            return true;
        }
        else{
            return false;
        }
    }

    TileIsOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType): boolean{
        const piece = boardState.find((p) => samePosition(p.position, position) && p.team !== team);

        if(piece){
            return true;
        }
        else{
            return false;
        }
    }

    isEnPassantMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[] ){
        const pawnDirection = team === TeamType.OUR ? 1 : -1;
        

        if(type === PieceType.PAWN){
            // ATTACK LOGIC
            if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection){
                const piece = boardState.find(p => samePosition(p.position, {x: desiredPosition.x, y: (desiredPosition.y - pawnDirection)}) && p.enPassant);

                if(piece){
                    return true;
                }
            }
        }
        

        // Put piece in correct position
        // Remove en passanted piece
        return false;
    }

    pawnMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean{
        const specialRow = (team === TeamType.OUR) ? 1 : 6;
        const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

        if(initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2 * pawnDirection){
            if(!this.tileIsOccupied(desiredPosition, boardState) && !this.tileIsOccupied({x: desiredPosition.x, y: desiredPosition.y - pawnDirection}, boardState)){
                return true;
            }
        }
        else if ( initialPosition.x  === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection){
            if(!this.tileIsOccupied(desiredPosition, boardState)){
                return true;
            }
        }

        // ATTACK LOGIC
        else if(desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection){
            // ATTACK IN UPPER OR BOTTOM LEFT CONRER
            if(this.TileIsOccupiedByOpponent(desiredPosition, boardState, team)){
                return true;
            }
        }
        else if(desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y == pawnDirection){
            if(this.TileIsOccupiedByOpponent(desiredPosition, boardState, team)){
                return true;
            }
        }
        return false;
    }
    knightMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean{
        //MOVING LOGIC FOR THE KNIGHT
        for(let i = -1; i < 2; i+=2){
            for(let j = -1; j < 2; j+=2){
                if(desiredPosition.y - initialPosition.y === 2 * i){
                    if(desiredPosition.x - initialPosition.x ===  j){
                        if(this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)){
                            return true;
                        }
                    }
                }
                if(desiredPosition.x - initialPosition.x === 2 * i){
                    if(desiredPosition.y - initialPosition.y ===  j){
                        if(this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)){
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }
    bishopMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean{
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
                if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                    return true;
                }
            }
            else if(this.tileIsOccupied(passedPosition, boardState)){
                break;
            }
        }
        return false;
    }

    rookMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean{

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
            let passedPosition: Position = {x: initialPosition.x + (i * x), y: initialPosition.y + (i * y)};
            // 경로상에 기물이 있는지 확인
            // Check if the passed tile is occupied
            if(samePosition(desiredPosition, passedPosition)){
                // is it occupied by the opponent?
                if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                    return true;
                }
            }
            else if(this.tileIsOccupied(passedPosition, boardState)){
                break;
            }
        }
        return false;
    }
    isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]){

        let validMode = false;
        // MOVEMENT LOGIC
        switch (type) {
            case PieceType.PAWN:
                validMode = this.pawnMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.KNIGHT:
                validMode = this.knightMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.BISHOP:
                validMode = this.bishopMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.ROOK:
                validMode = this.rookMove(initialPosition, desiredPosition, team, boardState);
                break;
            default:
                break;
        }

        return validMode;

    }
}
