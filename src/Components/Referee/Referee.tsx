import React, { useEffect, useRef, useState } from 'react'
import { initialBoardState, PieceImage } from '../../Constants';
import { Pawn } from '../../models/Pawn';
import { Piece } from '../../models/Piece';
import { Position } from '../../models/Position';
import { bishopMove, GetPossibleBishopMoves, GetPossibleKingMoves, GetPossibleKnightMoves, GetPossiblePawnMoves, GetPossibleQueenMoves, GetPossibleRookMoves, kingMove, knightMove, pawnMove, queenMove, rookMove } from '../../Referee/rules';
import { PieceType, TeamType } from '../../Types';
import Chessboard from '../ChessBoard/Chessboard'

const Referee = () => {
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        updatePossibleMoves();
    }, []);

    
    function updatePossibleMoves(): void[]{
        setPieces((currentPieces) => {
            return currentPieces.map(p => {
                p.possibleMoves = getValidMoves(p, currentPieces);
                return p;
            });
        });
        return [];
    }

    function playMove(playedPiece: Piece, destination: Position): boolean{
        const validMove = isValidMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);
                
        const enEnPassantMove = isEnPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);
        
        const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;


        if(enEnPassantMove){
            const updatedPieces = pieces.reduce((results, piece) =>{
                if(piece.samePiecePosition(playedPiece)){
                    if(piece.isPawn)
                        (piece as Pawn).enPassant = false;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
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

            updatePossibleMoves();
            setPieces(updatedPieces);
        }
        else if(validMove){

            const updatedPieces = pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(playedPiece)){
                    // SPECIAL MOVE
                    if(piece.isPawn)
                        (piece as Pawn).enPassant = Math.abs(playedPiece.position.y - destination.y) === 2;
                    
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    
                    let promotionRow = (piece.team === TeamType.OUR) ? 7 : 0;
                    if(destination.y === promotionRow && piece.isPawn){
                        modalRef.current?.classList.remove("hidden");
                        setPromotionPawn(piece);
                    }
                    results.push(piece);
                }
                else if(!(piece.samePosition(new Position(destination.x, destination.y)))){
                    if(piece.isPawn){
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece);
                }

                return results;
            }, [] as Piece[]);

            updatePossibleMoves();
            setPieces(updatedPieces);
        }
        else{
            // RESETS THE PIECE POSITION
            return false;
        }

        return true;
    }

    function isEnPassantMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType){
        const pawnDirection = team === TeamType.OUR ? 1 : -1;
        

        if(type === PieceType.PAWN){
            // ATTACK LOGIC
            if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection){
                const piece = pieces.find(p => p.samePosition(new Position(desiredPosition.x, desiredPosition.y - pawnDirection))
                && p.isPawn && (p as Pawn).enPassant
                );

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
    function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType){

        let validMode = false;
        // MOVEMENT LOGIC
        switch (type) {
            case PieceType.PAWN:
                validMode = pawnMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.KNIGHT:
                validMode = knightMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.BISHOP:
                validMode = bishopMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.ROOK:
                validMode = rookMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.QUEEN:
                validMode = queenMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.KING:
                validMode = kingMove(initialPosition, desiredPosition, team, pieces);
                break;
            default:
                break;
        }
        return validMode;

    }
    function getValidMoves(piece: Piece, boardState: Piece[]) : Position[] {
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
    function promotePawn(pieceType: PieceType){
        if(promotionPawn === undefined){
            return;
        }
        const updatedPieces = pieces.reduce((results, piece) => {
            if(piece.samePosition(promotionPawn.position)){
                piece.type = pieceType;
                piece.image = PieceImage[piece.team][pieceType];
            }
            results.push(piece);
            return results;
        }, [] as Piece[]);

        updatePossibleMoves();
        setPieces(updatedPieces);
        modalRef.current?.classList.add("hidden");
    }

    function promotionTeamType() {
        return (promotionPawn?.team === TeamType.OUR) ? "l" : "b";
    }

    return <>
        <div id="pawn-promotion-modal" className='hidden' ref={modalRef}>
            <div className="modal-body">
                <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/Chess_b${promotionTeamType()}t60.png`} alt="" />
                <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/Chess_r${promotionTeamType()}t60.png`} alt="" />
                <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/Chess_n${promotionTeamType()}t60.png`} alt="" />
                <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/Chess_q${promotionTeamType()}t60.png`} alt="" />
            </div>
        </div>
        <Chessboard playMove={playMove} pieces={pieces}/>
    </>
}

export default Referee