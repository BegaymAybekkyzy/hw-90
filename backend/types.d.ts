export interface IDrawing {
    x: number;
    y: number;
    color: string;
}

export interface IncomingMessage {
    type: string;
    payload: IDrawing[][];
}