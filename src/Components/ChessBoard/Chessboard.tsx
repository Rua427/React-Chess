import React, { useRef, useState} from 'react'
import './Chessboard.css'
import Tile from '../Tile/Tile';
import Referee from '../Referee/Referee';
import {
    VERTICAL_AXIS, 
    HORIZONTAL_AXIS, 
    GRID_SIZE,
    Piece, 
    PieceType, 
    TeamType, 
    initialBoardState, 
    Position,
    samePosition,
} from '../../Constants';

const Chessboard = () => {
    // const [gridX, setGridX] = useState(0);
    // const [gridY, setGridY] = useState(0);
    const [grabPosition, setGrabPosition] = useState<Position  >({x: - 1, y: -1});
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();
    
    // console.log("Call"); 
    // useEffect(() =>{
        //     activePiece = null;
        // },[]);
        

    const grabPiece = (e: React.MouseEvent) =>{
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        
        if(element.classList.contains("chess-piece") && chessboard){
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
            setGrabPosition({
                x: grabX,
                y: grabY
            });
            const x = e.clientX - (GRID_SIZE / 2);
            const y = e.clientY - (GRID_SIZE / 2);
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
            // console.log(activePiece);
        }
    }

    const movePiece = (e: React.MouseEvent) => {
        const chessboard = chessboardRef.current;

        if(activePiece && chessboard){
            const minX = chessboard.offsetLeft - 25;
            const minY = chessboard.offsetTop  - 25;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
            const maxY = chessboard.offsetTop  + chessboard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            activePiece.style.position = "absolute";
            // activePiece.style.left = `${x}px`;
            // activePiece.style.top = `${y}px`;


            if(x < minX){
                activePiece.style.left = `${minX}px`;
            }
            else if(x > maxX){
                activePiece.style.left = `${maxX}px`;
            }
            else{
                activePiece.style.left = `${x}px`;
            }

            if(y < minY){
                activePiece.style.top = `${minY}px`;
            }
            else if(y > maxY){
                activePiece.style.top = `${maxY}px`;
            }
            else{
                activePiece.style.top = `${y}px`;
            }
        }
    }

    const dropPiece = (e: React.MouseEvent) => {
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            // console.log("drop");
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
            
            // 얕은 복사가 이루어진다.
            // pieces.reduce를 수행하면서 currentPiece의 값이 의도치 않게 바뀌게 됨.
            const currentPiece = pieces.find(p => 
                samePosition(p.position, grabPosition)
            );

            // currentPiece

            if(currentPiece){
                const validMove = referee.isValidMove(grabPosition, {x: x, y: y}, currentPiece.type, currentPiece.team, pieces);
                
                const isEnPassantMove = referee.isEnPassantMove(grabPosition, {x: x, y: y}, currentPiece.type, currentPiece.team, pieces);
                
                const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;


                if(isEnPassantMove){
                    const updatedPieces = pieces.reduce((results, piece) =>{
                        if(samePosition(piece.position, grabPosition)){
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            results = results.concat(piece);
                        }
                        else if(!(samePosition(piece.position, {x: x, y: (y - pawnDirection)}))){
                            if(piece.type === PieceType.PAWN){
                                piece.enPassant = false;
                            }
                            results = results.concat(piece);
                        }

                        return results;
                    }, [] as Piece[]);
                    setPieces(updatedPieces);
                }
                else if(validMove){

                    const updatedPieces = pieces.reduce((results, piece) => {
                        if(samePosition(piece.position, grabPosition)){
                            
                            // SPECIAL MOVE
                            piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === PieceType.PAWN;
                            
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        }
                        else if(!(samePosition(piece.position, {x: x, y:  y}))){
                            if(piece.type === PieceType.PAWN){
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }

                        return results;
                    }, [] as Piece[]);

                    setPieces(updatedPieces);
                }
                else{
                    // RESETS THE PIECE POSITION
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
            }
            setActivePiece(null);
        }

    }

    let board: any = [];

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const number = j + i + 2;
            const piece = pieces.find(p => samePosition(p.position, {x: i, y: j}));

            let image = piece ? piece.image : undefined;

            // pieces.forEach(p=> {
            //     if(p.position.x === i && p.position.y === j){
            //         image = p.image;
            //     }
            // });

            board = board.concat(<Tile key={board} image={image} number={number}/>);
        }
        
    }

  return (
    <div
        onMouseDown={e => grabPiece(e)}
        onMouseMove={e => movePiece(e)}
        onMouseUp={e => {dropPiece(e)}}
        id='chessboard'
        ref={chessboardRef}
    >
        {board}
    </div>
  )
}

export default Chessboard
