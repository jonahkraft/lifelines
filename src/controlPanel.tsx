import {type ChangeEvent, type RefObject, useState} from "react";
import {type SimulationContext} from "./types.ts";
import {ToggleSimulationButton} from "./toggleSimulationButton.tsx";
import {setupMatrix, simulateSzenario} from "./simulation.ts";
import {DEFAULT_CONTEXT} from "./constants.ts";
import ResetContextButton from "./resetContextButton.tsx";


type ControlPanelProps = {
    canvasRef: RefObject<HTMLCanvasElement | null>,
    globalContext: SimulationContext,
    isRunningRef: RefObject<boolean>,
    setGlobalContext: (context: SimulationContext) => void,
}

const ControlPanel = ({canvasRef, globalContext, isRunningRef, setGlobalContext}: ControlPanelProps) => {
    const [localContext, setLocalContext] = useState<SimulationContext>(globalContext);

    /**
     * Generic function that returns a function which updates one attribute of "localContext" which has the type number.
     * @param field The key of the attribute to modify
     */
    const handleNumChange = (field: keyof SimulationContext) => (e: ChangeEvent<HTMLInputElement>)=>  {
        if (field === "rows") {
            setLocalContext(prev => ({
                ...prev,
                [field]: Number(e.target.value),
                matrix: setupMatrix(localContext.initialAliveRate, Number(e.target.value), localContext.columns)
            }));
        }
        else if (field === "columns") {
            setLocalContext(prev => ({
                ...prev,
                [field]: Number(e.target.value),
                matrix: setupMatrix(localContext.initialAliveRate, localContext.rows, Number(e.target.value))
            }));
        }
        else {
            setLocalContext(prev => ({
                ...prev,
                [field]: Number(e.target.value),
                matrix: setupMatrix(localContext.initialAliveRate, localContext.rows, localContext.columns)
            }));
        }
    }

    /**
     * Updates the initialAliveRate attribute of the context
     */
    const handleInitialAliveRateChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (Math.abs(localContext.initialAliveRate -  Number(e.target.value) / 100) < 0.0005) return;

        setLocalContext(prev => ({
            ...prev,
            initialAliveRate: Number(e.target.value) / 100,
            matrix: setupMatrix(Number(e.target.value) / 100, localContext.rows, localContext.columns)
        }));
    }

    /**
     * Updates aliveToAliveCondition or deadToAliveCondition
     */
    const handleListInputChange = (field: "aliveToAliveCondition" | "deadToAliveCondition") => (e: ChangeEvent<HTMLInputElement>) => {
        try {
            const arr = e.target.value.split(",").map(s => Number(s.trim()));

            setLocalContext(prev => ({
                ...prev,
                [field]: arr,
                matrix: setupMatrix(localContext.initialAliveRate, localContext.rows, localContext.columns)
            }));
        }
        catch (e) {
            console.error(e);
        }
    }

    /**
     * Starts the simulation
     */
    const startSimulation = (callbackFunction: () => void) => () => {
        simulateSzenario(canvasRef.current!, localContext, isRunningRef, callbackFunction);
    }

    /**
     * Resets the context
     */
    const resetContext = () => {
        if (!isRunningRef.current) {
            setLocalContext(structuredClone(DEFAULT_CONTEXT));
            setGlobalContext(structuredClone(DEFAULT_CONTEXT));
        }
    }

    return(
        <div className="m-4 p-2 border border-stone-300 bg-stone-100 text-stone-800 rounded-md flex-[0_0_auto] shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Simulation settings</h2>

            <div className="m-2 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
                <div className="flex flex-col gap-2">
                    <label>Number of rows:</label>
                    <input
                        type="number"
                        className="bg-white border-stone-300 border rounded-md p-1 focus:outline-none focus:ring focus:ring-amber-400 h-9 w-1/2"
                        min={3}
                        max={100000}
                        placeholder={localContext.rows.toString()}
                        onChange={handleNumChange("rows")}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label>Number of columns:</label>
                    <input
                        type="number"
                        className="bg-white border-stone-300 border rounded-md p-1 focus:outline-none focus:ring focus:ring-amber-400 h-9 w-1/2"
                        min={3}
                        max={100000}
                        placeholder={localContext.columns.toString()}
                        onChange={handleNumChange("columns")}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label>Number of iterations:</label>
                    <input
                        type="number"
                        className="bg-white border-stone-300 border rounded-md p-1 focus:outline-none focus:ring focus:ring-amber-400 h-9 w-1/2"
                        min={1}
                        max={100000}
                        placeholder={localContext.numIterations.toString()}
                        onChange={handleNumChange("numIterations")}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label>Initial alive rate (in %):</label>
                    <input
                        type="number"
                        className="bg-white border-stone-300 border rounded-md p-1 focus:outline-none focus:ring focus:ring-amber-400 h-9 w-1/2"
                        min={1}
                        max={100}
                        placeholder={Math.floor(localContext.initialAliveRate * 100).toString()}
                        onChange={handleInitialAliveRateChange}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label>Sleep duration (in ms):</label>
                    <input
                        type="number"
                        className="bg-white border-stone-300 border rounded-md p-1 focus:outline-none focus:ring focus:ring-amber-400 h-9 w-1/2"
                        min={1}
                        max={100000}
                        placeholder={localContext.sleepDuration.toString()}
                        onChange={handleNumChange("sleepDuration")}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label>Dead to alive condition:</label>
                    <input
                        type="text"
                        className="bg-white border-stone-300 border rounded-md p-1 focus:outline-none focus:ring focus:ring-amber-400 h-9 w-1/2"
                        min={1}
                        max={100}
                        placeholder={localContext.deadToAliveCondition.toString()}
                        onChange={handleListInputChange("deadToAliveCondition")}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label>Alive to alive condition:</label>
                    <input
                        type="text"
                        className="bg-white border-stone-300 border rounded-md p-1 focus:outline-none focus:ring focus:ring-amber-400 h-10 w-1/2"
                        min={1}
                        max={100}
                        placeholder={localContext.aliveToAliveCondition.toString()}
                        onChange={handleListInputChange("aliveToAliveCondition")}
                    />
                </div>
            </div>
            <div className="flex gap-4">
                <ToggleSimulationButton isRunningRef={isRunningRef} onClick={() => setGlobalContext(localContext)} startSimulation={startSimulation}/>
                <ResetContextButton onClick={resetContext}/>
            </div>
        </div>
    )
}

export default ControlPanel;
