
import {PieceType, TeamType, Piece, Position, samePosition} from '../../Constants'

export default class Referee {

    tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean{
        const piece = boardState.find(p => p.position.x === x && p.position.y === y)

        if(piece){
            return true;
        }
        else{
            return false;
        }
    }

    TileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean{
        const piece = boardState.find((p) => p.position.x === x && p.position.y === y && p.team !== team);

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
                if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState) && !this.tileIsOccupied(desiredPosition.x, desiredPosition.y - pawnDirection, boardState)){
                    return true;
                }
            }
            else if ( initialPosition.x  === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection){
                if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)){
                    return true;
                }
            }

            // ATTACK LOGIC
            else if(desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection){
                // ATTACK IN UPPER OR BOTTOM LEFT CONRER
                if(this.TileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team)){
                    return true;
                }
            }
            else if(desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y == pawnDirection){
                if(this.TileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team)){
                    return true;
                }
            }
            
        }
        
        return false;
    }
}
