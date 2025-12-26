import {type ChangeEvent, type RefObject, useState} from "react";
import {type SimulationContext} from "./types.ts";
import {ToggleSimulationButton} from "./toggleSimulationButton.tsx";
import {setupMatrix, simulateSzenario} from "./simulation.ts";
import {DEFAULT_CONTEXT} from "./constants.ts";
import ResetContextButton from "./resetContextButton.tsx";
import ControlPanelInput from "./controlPanelInput.tsx";


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
                <ControlPanelInput
                    title="Number of rows"
                    type="number"
                    placeholder={localContext.rows.toString()}
                    onChange={handleNumChange("rows")}
                    min={3}
                    max={100000}
                />

                <ControlPanelInput
                    title="Number of columns"
                    type="number"
                    placeholder={localContext.columns.toString()}
                    onChange={handleNumChange("columns")}
                    min={3}
                    max={100000}
                />

                <ControlPanelInput
                    title="Number of iterations"
                    type="number"
                    placeholder={localContext.numIterations.toString()}
                    onChange={handleNumChange("numIterations")}
                    min={1}
                    max={100000}
                />

                <ControlPanelInput
                    title="Initial alive rate (in %)"
                    type="number"
                    placeholder={Math.floor(localContext.initialAliveRate * 100).toString()}
                    onChange={handleInitialAliveRateChange}
                    min={1}
                    max={100}
                />

                <ControlPanelInput
                    title="Sleep duration (in ms)"
                    type="number"
                    placeholder={localContext.sleepDuration.toString()}
                    onChange={handleNumChange("sleepDuration")}
                    min={1}
                    max={100000}
                />

                <ControlPanelInput
                    title="Dead to alive condition"
                    type="text"
                    placeholder={localContext.deadToAliveCondition.toString()}
                    onChange={handleListInputChange("deadToAliveCondition")}
                />

                <ControlPanelInput
                    title="Alive to alive condition"
                    type="text"
                    placeholder={localContext.aliveToAliveCondition.toString()}
                    onChange={handleListInputChange("aliveToAliveCondition")}
                />
            </div>

            <div className="flex gap-4 pt-2 mt-4 border-t border-stone-300 w-fit">
                <ToggleSimulationButton isRunningRef={isRunningRef} onClick={() => setGlobalContext(localContext)} startSimulation={startSimulation}/>
                <ResetContextButton onClick={resetContext}/>
            </div>
        </div>
    )
}

export default ControlPanel;
