import React, { useRef, useState} from 'react'
import './Chessboard.css'
import Tile from '../Tile/Tile';
import {
    VERTICAL_AXIS, 
    HORIZONTAL_AXIS, 
    GRID_SIZE,
    samePosition,
} from '../../Constants';
import { Position, Piece } from '../../models';

interface Props{
    playMove: (piece: Piece, position: Position) => boolean;
    pieces: Piece[];
}

const Chessboard = ({playMove, pieces}: Props) => {
    // const [gridX, setGridX] = useState(0);
    // const [gridY, setGridY] = useState(0);
    const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const chessboardRef = useRef<HTMLDivElement>(null);
    
    const grabPiece = (e: React.MouseEvent) => {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;

        if(element.classList.contains("chess-piece") && chessboard){

            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
            setGrabPosition(new Position(grabX, grabY));
            const x = e.clientX - (GRID_SIZE / 2);
            const y = e.clientY - (GRID_SIZE / 2);
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    const movePiece = (e: React.MouseEvent) => {
        const chessboard = chessboardRef.current;

        if(activePiece && chessboard){
            console.log(activePiece, chessboard);
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
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
            
            // 얕은 복사가 이루어진다.
            // pieces.reduce를 수행하면서 currentPiece의 값이 의도치 않게 바뀌게 됨.
            const currentPiece = pieces.find(p => 
                samePosition(p.position, grabPosition)
            );

            // currentPiece

            if(currentPiece){
                var success = playMove(currentPiece, new Position(x, y));

                if(!success){
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
            const piece = pieces.find(p => samePosition(p.position, new Position(i, j)));

            let image = piece ? piece.image : undefined;
            let currentPiece = activePiece != null ? pieces.find(p => samePosition(p.position, grabPosition)) : undefined;
            let highlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(p => samePosition(p, new Position(i, j))) : false;

            board = board.concat(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight}/>);
        }
        
    }

    return (
        <>
        <div
            onMouseDown={e => grabPiece(e)}
            onMouseMove={e => movePiece(e)}
            onMouseUp={e => {dropPiece(e)}}
            id='chessboard'
            ref={chessboardRef}
        >
            {board}
        </div>
        </>
    )
}

export default Chessboard
