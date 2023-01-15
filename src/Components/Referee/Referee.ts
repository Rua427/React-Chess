
import {PieceType, TeamType, Piece, Position, samePosition} from '../../Constants'
import {pawnMove, bishopMove, kingMove, knightMove, queenMove, rookMove} from './rules'
export default class Referee {
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
    
    // TODO
    // pawn Promotion
    // Prevent the king from moving into danger!
    // Add castling!
    // Add check!
    // Add checkmate!
    // Add stalemate!
    isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]){

        let validMode = false;
        // MOVEMENT LOGIC
        switch (type) {
            case PieceType.PAWN:
                validMode = pawnMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.KNIGHT:
                validMode = knightMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.BISHOP:
                validMode = bishopMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.ROOK:
                validMode = rookMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.QUEEN:
                validMode = queenMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.KING:
                validMode = kingMove(initialPosition, desiredPosition, team, boardState);
                break;
            default:
                break;
        }
        return validMode;

    }

    getValidMoves() : Position[] {


        return [];
    }
}
