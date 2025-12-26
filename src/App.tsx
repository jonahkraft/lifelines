import { useEffect, useRef, useState } from "react";
import {type SimulationContext} from "./types.ts";
import {drawMatrix} from "./simulation.ts";
import ControlPanel from "./controlPanel.tsx";
import {DEFAULT_CONTEXT} from "./constants.ts";

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
    const [context, setContext] = useState<SimulationContext>(structuredClone(DEFAULT_CONTEXT));
    const isRunningRef = useRef(false);

    /**
     * Updates the size of the canvas and redraws the matrix if the window is resized.
     */
    useEffect(() => {
        resizeCanvas(canvasRef.current);
        drawMatrix(canvasRef.current!, context);

        const handleResize = () => {
            if (resizeCanvas(canvasRef.current)) {
                drawMatrix(canvasRef.current!, context);
            }
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [context]);

    return (
        <div className="w-screen h-screen m-0 flex flex-col">
            <ControlPanel
                canvasRef={canvasRef}
                globalContext={context}
                isRunningRef={isRunningRef}
                setGlobalContext={setContext}
            />
            <canvas ref={canvasRef} className="w-full flex-[1_1_0]"></canvas>
        </div>
    )
}

export default App;
