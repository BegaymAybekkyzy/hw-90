import AppToolbar from "./components/AppToolbar/AppToolbar.tsx";
import {useEffect, useRef, useState} from "react";
import * as React from "react";

const App = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth * 0.7;
        canvas.height = window.innerHeight * 0.7;
        const context = canvas.getContext('2d');

        if (!context) return;
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 10;
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
        console.log(contextRef.current)
        setIsDrawing(true);
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !contextRef.current) return;

        const {offsetX, offsetY} = event.nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        console.log(contextRef.current)
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        if (!contextRef.current) return;
        contextRef.current.closePath();
        console.log(contextRef)
        setIsDrawing(false);
    };

    const setToDraw = () => {
        if (!contextRef.current) return;
        contextRef.current.globalCompositeOperation = 'source-over';
    };


    const setToErase = () => {
        if (!contextRef.current) return;
        contextRef.current.globalCompositeOperation = 'destination-out';
    };

    return (
        <>
            <header className="mb-5">
                <AppToolbar/>
            </header>

            <main className="container">
               <div>
                   <canvas
                       className="border border-dark "
                       ref={canvasRef}
                       onMouseDown={startDrawing}
                       onMouseMove={draw}
                       onMouseUp={stopDrawing}
                       onMouseLeave={stopDrawing}>
                   </canvas>
                   <div>
                       <button onClick={setToDraw}>
                           Draw
                       </button>
                       <button onClick={setToErase}>
                           Erase
                       </button>
                   </div>
               </div>
            </main>
        </>
    )
};

export default App
