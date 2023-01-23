import { GetPossibleBishopMoves, GetPossibleKingMoves, GetPossibleKnightMoves, GetPossiblePawnMoves, GetPossibleQueenMoves, GetPossibleRookMoves } from "../Referee/rules";
import { PieceType, TeamType } from "../Types";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Board{
    pieces: Piece[];

    constructor(pieces: Piece[]){
        this.pieces = pieces;
    }

    calculateAllMoves() {
        for(const piece of this.pieces){
            piece.possibleMoves = this.getValidMoves(piece, this.pieces);
        }
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
                return GetPossibleQueenMoves(piece, boardState);
            case PieceType.KING:
                return GetPossibleKingMoves(piece, boardState);
            default:
                return [];
        }
    }

    playMove(enPassantMove: boolean, validMove: boolean, playedPiece: Piece, destination: Position): boolean {

        const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;

        if(enPassantMove){
            this.pieces = this.pieces.reduce((results, piece) =>{
                if(piece.samePiecePosition(playedPiece)){
                    if(piece.isPawn)
                        (piece as Pawn).enPassant = false;

                    piece.position = destination;
                    results = results.concat(piece);
                }
                else if(!(piece.position.samePosition(new Position(destination.x, destination.y - pawnDirection)))){
                    if(piece.isPawn){
                        (piece as Pawn).enPassant = false;
                    }
                    results = results.concat(piece);
                }

                return results;
            }, [] as Piece[]);

            this.calculateAllMoves();
        }
        else if(validMove){

            this.pieces = this.pieces.reduce((results, piece) => {
                // Piece that we are currently moving
                if(piece.samePiecePosition(playedPiece)){
                    // SPECIAL MOVE
                    if(piece.isPawn)
                        (piece as Pawn).enPassant = Math.abs(playedPiece.position.y - destination.y) === 2;
                    
                    piece.position = destination;
                    
                    results.push(piece);
                }
                else if(!piece.samePosition(destination)){
                    if(piece.isPawn){
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece);
                }

                //
                //as

                return results;
            }, [] as Piece[]);

            this.calculateAllMoves();
        }
        else{
            // RESETS THE PIECE POSITION
            return false;
        }

        return true;
    }

    clone(): Board{
        return new Board(this.pieces.map(p => p.clone()));
        // return new Board(this.pieces.map(p => p.clone()));
    }
}