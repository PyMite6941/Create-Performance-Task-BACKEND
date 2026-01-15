export interface recieveMove {
    // Interface for recieving moves
    FEN: string;
    from: [number, number];
    to: [number, number];
    figure: { 
        color: "white" | "black";
        type: "pawn" | "bishop" | "knigts" | "rook" | "queen" | "king";
    };
}

interface Figure {
    color: "white" | "black";
    type: "pawn" | "bishop" | "knight" | "rook" | "queen" | "king";
}

interface MoveData {
    FEN: string;
    from: [number, number];
    to: [number, number];
    figure: Figure;
    type: 'move' | 'transform';
}

export interface sendMove {
    // Interface for updating moves to the clients
    move: MoveData;
    withTransition?: boolean;
    transformTo?: Figure;
}