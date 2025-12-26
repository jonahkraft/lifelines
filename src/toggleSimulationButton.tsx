import {type RefObject, useState} from "react";
import {Check, X} from "lucide-react";


type SimulationBtnProps = {
    isRunningRef: RefObject<boolean>,
    onClick: () => void,
    startSimulation: (callbackFunction: () => void) => () => void
}

export const ToggleSimulationButton = ({isRunningRef, onClick, startSimulation}: SimulationBtnProps) => {
    const [isRunning, setIsRunning] = useState(false);

    /**
     * Toggles the local and global state of isRunning.
     * The simulation is started explicitly if desired.
     * However, if isRunning (global) is set the false, the simulation ends.
     */
    const handleClick = () => {
        onClick();

        if (isRunning) {
            setIsRunning(false);
            isRunningRef.current = false;
        } else {
            setIsRunning(true);
            isRunningRef.current = true;
            startSimulation(() => setIsRunning(false))();
        }
    }

    return(
        <button
            onClick={handleClick}
            className={
                `${isRunning
                    ? "bg-gray-400 hover:bg-gray-500"
                    : "bg-amber-400 hover:bg-amber-500"}
                rounded-lg m-2 p-2 cursor-pointer flex gap-2 h-9 shadow-sm    
                    `
            }
        >
            <div className="flex items-center">
                { isRunning ? <X className="w-5 h-5"/> : <Check className="w-5 h-5"/> }
            </div>

            <div className="flex items-center">
                { isRunning ? "Stop simulation" : "Start simulation" }
            </div>
        </button>
    )
}
