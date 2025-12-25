import {simulateSzenario} from "./simulation.ts";
import {type SimulationContext} from "./types.ts";
import {type RefObject, useState} from "react";
import {Check, X} from "lucide-react";


type SimulationBtnProps = {
    canvasRef: RefObject<HTMLCanvasElement | null>,
    contextRef: RefObject<SimulationContext>,
    isRunningRef: RefObject<boolean>
}

export const ToggleSimulationButton = ({canvasRef, contextRef, isRunningRef}: SimulationBtnProps) => {
    const [isRunning, setIsRunning] = useState(false);

    /**
     * Toggles the local and global state of isRunning.
     * The simulation is started explicitly if desired.
     * However, if isRunning (global) is set the false, the simulation ends.
     */
    const handleClick = () => {
        if (isRunning) {
            setIsRunning(false);
            isRunningRef.current = false;
        } else {
            setIsRunning(true);
            isRunningRef.current = true;
            simulateSzenario(canvasRef.current!, contextRef.current, isRunningRef, () => setIsRunning(false));
        }
    }

    return(
        <button
            onClick={handleClick}
            className={
                `${isRunning
                    ? "bg-gray-400 border-gray-700"
                    : "bg-amber-400 border-amber-500"}
                rounded-lg m-2 p-2 cursor-pointer flex gap-2    
                    `
            }
        >
            { isRunning ? "Stop simulation" : "Start simulation" }
            { isRunning ? <X /> : <Check /> }
        </button>
    )
}
