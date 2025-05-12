export interface IDrawing {
    x: number;
    y: number;
}

export interface IncomingMessage {
    type: string;
    payload: IDrawing[][];
}