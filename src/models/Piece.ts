import { PieceImage} from "../Constants";
import { Position } from "./Position";
import { PieceType, TeamType } from '../Types';


export class Piece {
    image: string;
    position: Position;
    type: PieceType;
    team: TeamType;
    possibleMoves?: Position[];
    
    constructor(position: Position, type: PieceType, team: TeamType, possibleMoves: Position[] = []) {
        this.image = PieceImage[team][type];
        this.position = position;
        this.type = type;
        this.team = team;
        this.possibleMoves = possibleMoves;
    }

    get isPawn(): boolean{
        return this.type === PieceType.PAWN;
    }
    get isRook(): boolean{
        return this.type === PieceType.ROOK;
    }
    get isKnight(): boolean{
        return this.type === PieceType.KNIGHT;
    }
    get isBishop(): boolean{
        return this.type === PieceType.BISHOP;
    }
    get isKing(): boolean{
        return this.type === PieceType.KING;
    }
    get isQueen(): boolean{
        return this.type === PieceType.QUEEN;
    }

    samePiecePosition(otherPiece: Piece): boolean{
        return this.position.samePosition(otherPiece.position);
    }
    samePosition(otherPosition: Position): boolean{
        return this.position.samePosition(otherPosition);
    }

    clone(): Piece{
        return new Piece(this.position.clone(), this.type, this.team, this.possibleMoves?.map(p => p.clone()));
    }
}