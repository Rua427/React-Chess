
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
    isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]){
        // console.log("Referee is checking the move...");
        // console.log(`Previous Location : (${px}, ${py})`)
        // console.log(`Current Location : (${x}, ${y})`)
        // console.log(`Piece type : ${type}`)
        // console.log(`Team type : ${team}`)

        // MOVEMENT LOGIC
        if(type === PieceType.PAWN){
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
        }
        else if(type === PieceType.KNIGHT){
            //MOVING LOGIC FOR THE KNIGHT
            for(let i = -1; i < 2; i+=2){
                for(let j = -1; j < 2; j+=2){
                    if(desiredPosition.y - initialPosition.y === 2 * i){
                        if(desiredPosition.x - initialPosition.x ===  j){
                            console.log(i + " " + j);
                            if(this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)){
                                return true;
                            }
                        }
                    }
                    if(desiredPosition.x - initialPosition.x === 2 * i){
                        if(desiredPosition.y - initialPosition.y ===  j){
                            console.log(i + " " + j);
                            if(this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)){
                                return true;
                            }
                        }
                    }
                }
            }
        }
        
        return false;
    }
}
