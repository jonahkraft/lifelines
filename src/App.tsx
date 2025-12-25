import { useEffect, useRef } from "react";
import {type SimulationContext} from "./types.ts";
import {setupMatrix, drawMatrix} from "./simulation.ts";
import ControlPanel from "./controlPanel.tsx";

/**
 * Resizes canvas to match its display size.
 * @param canvas - The canvas element to resize
 * @returns `true` if resized, `false` otherwise
 */
const resizeCanvas = (canvas: HTMLCanvasElement | null) => {
    if (canvas == null) return false

    if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        return true;
    }

    return false;
};


const App = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<SimulationContext>({
        rows: 100,
        columns: 200,
        initialAliveRate: 0.3,
        matrix: setupMatrix(0.3, 100, 200),
        numIterations: 100,
        aliveToAliveCondition: [2, 3],
        deadToAliveCondition: [3],
        sleepDuration: 500,
    });
    const isRunningRef = useRef(false);

    /**
     * Updates the size of the canvas and redraws the matrix if the window is resized.
     */
    useEffect(() => {
        resizeCanvas(canvasRef.current);
        drawMatrix(canvasRef.current!, contextRef.current);

        const handleResize = () => {
            if (resizeCanvas(canvasRef.current)) {
                drawMatrix(canvasRef.current!, contextRef.current);
            }
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <ControlPanel canvasRef={canvasRef} contextRef={contextRef} isRunningRef={isRunningRef}/>
            <div className="w-screen h-screen m-0">
                <canvas ref={canvasRef} className="w-full h-full block"></canvas>
            </div>
        </>
    )
}

export default App;
