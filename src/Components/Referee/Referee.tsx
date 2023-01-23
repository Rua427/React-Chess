import React, { useEffect, useRef, useState } from 'react'
import { initialBoard, PieceImage } from '../../Constants';
import { Board } from '../../models/Board';
import { Pawn } from '../../models/Pawn';
import { Piece } from '../../models/Piece';
import { Position } from '../../models/Position';
import { bishopMove, kingMove, knightMove, pawnMove, queenMove, rookMove } from '../../Referee/rules';
import { PieceType, TeamType } from '../../Types';
import Chessboard from '../ChessBoard/Chessboard'

const Referee = () => {
    const [board, setBoard] = useState<Board>(initialBoard);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        updatePossibleMoves();
    }, []);

    
    function updatePossibleMoves() {
        board.calculateAllMoves();
    }

    function playMove(playedPiece: Piece, destination: Position): boolean{
        let playedMoveIsValid = false;
        const validMove = isValidMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);
                
        const enPassantMove = isEnPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);

        // play move modifies the board thus we
        // need to call set board;
        setBoard((previousBoard) => {
            //Playing the move
            playedMoveIsValid = board.playMove(enPassantMove, validMove, playedPiece, destination);
            return board.clone();
        })
        

        // This is for promoting a pawn
        let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;

        if(destination.y === promotionRow && playedPiece.isPawn){
            playedPiece.position = destination;
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn(playedPiece);
        }
        return playedMoveIsValid;
    }

    function isEnPassantMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType){
        const pawnDirection = team === TeamType.OUR ? 1 : -1;
        

        if(type === PieceType.PAWN){
            // ATTACK LOGIC
            if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection){
                const piece = board.pieces.find(p => p.samePosition(new Position(desiredPosition.x, desiredPosition.y - pawnDirection))
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
                validMode = pawnMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KNIGHT:
                validMode = knightMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.BISHOP:
                validMode = bishopMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.ROOK:
                validMode = rookMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.QUEEN:
                validMode = queenMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KING:
                validMode = kingMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            default:
                break;
        }
        return validMode;

    }
    
    function promotePawn(pieceType: PieceType){
        if(promotionPawn === undefined){
            return;
        }
        board.pieces = board.pieces.reduce((results, piece) => {
            if(piece.samePosition(promotionPawn.position)){
                piece.type = pieceType;
                piece.image = PieceImage[piece.team][pieceType];
            }
            results.push(piece);
            return results;
        }, [] as Piece[]);

        updatePossibleMoves();
        setPromotionPawn(undefined);
        modalRef.current?.classList.add("hidden");
    }

    function promotionTeamType() {
        return (promotionPawn?.team === TeamType.OUR) ? "l" : "d";
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
        <Chessboard playMove={playMove} pieces={board.pieces}/>
    </>
}

export default Referee