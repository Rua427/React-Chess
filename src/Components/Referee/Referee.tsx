
import {PieceType, TeamType, Piece, Position, samePosition} from '../../Constants'
import {pawnMove, bishopMove, kingMove, knightMove, queenMove, rookMove, 
    GetPossiblePawnMoves,
    GetPossibleKnightMoves,
    GetPossibleBishopMoves,
    GetPossibleRookMoves,
    GetPossibleQueenMove,
    GetPossibleKingMoves,
} from './rules'
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

    getValidMoves(piece: Piece, boardState: Piece[]) : Position[] {
        switch(piece.type){
            case PieceType.PAWN:
                //return moves
                return GetPossiblePawnMoves(piece, boardState);
            case PieceType.KNIGHT:
                return GetPossibleKnightMoves(piece, boardState);
            case PieceType.BISHOP:
                return GetPossibleBishopMoves(piece, boardState);
            case PieceType.ROOK:
                return GetPossibleRookMoves(piece, boardState);
            case PieceType.QUEEN:
                return GetPossibleQueenMove(piece, boardState);
            case PieceType.KING:
                return GetPossibleKingMoves(piece, boardState);
            default:
                return [];
        }
    }
}
