import AppToolbar from "./components/AppToolbar/AppToolbar.tsx";
import {useEffect, useRef, useState} from "react";
import * as React from "react";
import type {IDrawing, IncomingMessage} from "./types.s.ts";
import ColorBlock from "./components/ColorBlock/ColorBlock.tsx";

const App = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const ws = useRef<WebSocket | null>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [drawing, setDrawing] = useState<IDrawing[]>([]);
    const [color, setColor] = useState("black");

    const colorList = ["black", "purple", "red", "green", "blue", "yellow", "pink", "orange", "gray", "brown"];

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/draw-online");
        ws.current.onclose = () => console.log("Connection closed");

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data.toString()) as IncomingMessage;
            if (message.type === "NEW_MESSAGE") {
                message.payload.forEach((drawing: IDrawing[]) => {
                    drawingFromApi(drawing);
                });
            }
        };

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = 1000;
        canvas.height = 550;
        const context = canvas.getContext("2d");

        if (!context) return;
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        context.clearRect(0, 0, canvas.width, canvas.height);
        contextRef.current = context;
    }, []);

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const {offsetX, offsetY} = event.nativeEvent;
        if (!contextRef.current) return;

        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        setDrawing(prevState => [
            ...prevState,
            {
                x: offsetX,
                y: offsetY,
                color,
            }
        ]);
        setIsDrawing(true);
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !contextRef.current) return;

        const {offsetX, offsetY} = event.nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);

        setDrawing(prevState => [
            ...prevState,
            {
                x: offsetX,
                y: offsetY,
                color,
            }
        ]);
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        if (!contextRef.current) return;
        contextRef.current.closePath();
        setIsDrawing(false);

        if (ws.current && drawing.length > 0) {
            ws.current.send(JSON.stringify({
                type: "SEND_MESSAGE",
                payload: [drawing]
            }));
        }
        setDrawing([]);
    };

    const drawingFromApi = (drawing: IDrawing[]) => {
        const context = contextRef.current;
        if (!context || drawing.length === 0) return;

        context.beginPath();
        context.moveTo(drawing[0].x, drawing[0].y);

        for (let i = 1; i < drawing.length; i++) {
            context.lineTo(drawing[i].x, drawing[i].y);
            context.strokeStyle = drawing[i].color;
        }

        context.stroke();
        context.closePath();
        setDrawing([]);
    };

    const colorChange = (color: string) => {
        if (!contextRef.current) return;
        setColor(color);
        contextRef.current.strokeStyle = color;
    }

    return (
        <>
            <header className="mb-5">
                <AppToolbar/>
            </header>

            <main className="container">
                <h1 className="text-center">Online collaborative drawing board</h1>
                <p className="text-center mb-5">This canvas is shared by everyone. You can only draw with the mouse.</p>
                <div className="d-flex justify-content-center gap-3">
                    <canvas
                        className="d-block"
                        style={{borderRadius: "10px", border: "1px solid #808080", backgroundColor: "#edebeb"}}
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}>
                    </canvas>
                    <div className="d-flex flex-column gap-2">
                        {colorList.map((color, index) => (
                            <ColorBlock key={index} colorChange={colorChange} color={color}/>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
};

export default App
