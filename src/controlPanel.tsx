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
    const handleNumInputChange = (field: keyof SimulationContext) => (e: ChangeEvent<HTMLInputElement>)=>  {
        switch (field) {
            case "rows":
                setLocalContext(prev => ({
                    ...prev,
                    [field]: Number(e.target.value),
                    matrix: setupMatrix(localContext.initialAliveRate, Number(e.target.value), localContext.columns)
                }));
                break;

            case "columns":
                setLocalContext(prev => ({
                    ...prev,
                    [field]: Number(e.target.value),
                    matrix: setupMatrix(localContext.initialAliveRate, localContext.rows, Number(e.target.value))
                }));
                break;

            case "initialAliveRate":
                setLocalContext(prev => ({
                    ...prev,
                    [field]: Number(e.target.value),
                    matrix: setupMatrix(Number(e.target.value), localContext.rows, localContext.columns)
                }));
                break;

            default:
                setLocalContext(prev => ({
                    ...prev,
                    [field]: Number(e.target.value),
                    matrix: setupMatrix(localContext.initialAliveRate, localContext.rows, localContext.columns)
                }));
        }
    }

    /**
     * Generic function that returns a function which updates one attribute of "localContext" which has the type string.
     * @param field The key of the attribute to modify
     */
    const handleTextInputChange = (field: keyof SimulationContext) => (e: ChangeEvent<HTMLInputElement>) => {
        setLocalContext(prev => ({
            ...prev,
            [field]: e.target.value,
            matrix: setupMatrix(localContext.initialAliveRate, localContext.rows, localContext.columns)
        }));
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
                    value={localContext.rows}
                    placeholder={localContext.rows.toString()}
                    onChange={handleNumInputChange("rows")}
                    min={3}
                    max={100000}
                />

                <ControlPanelInput
                    title="Number of columns"
                    type="number"
                    value={localContext.columns}
                    placeholder={localContext.columns.toString()}
                    onChange={handleNumInputChange("columns")}
                    min={3}
                    max={100000}
                />

                <ControlPanelInput
                    title="Number of iterations"
                    type="number"
                    value={localContext.numIterations}
                    placeholder={localContext.numIterations.toString()}
                    onChange={handleNumInputChange("numIterations")}
                    min={1}
                    max={100000}
                />

                <ControlPanelInput
                    title="Initial alive rate (in %)"
                    type="number"
                    value={localContext.initialAliveRate}
                    placeholder={localContext.initialAliveRate.toString()}
                    onChange={handleNumInputChange("initialAliveRate")}
                    min={1}
                    max={100}
                />

                <ControlPanelInput
                    title="Sleep duration (in ms)"
                    type="number"
                    value={localContext.sleepDuration}
                    placeholder={localContext.sleepDuration.toString()}
                    onChange={handleNumInputChange("sleepDuration")}
                    min={1}
                    max={100000}
                />

                <ControlPanelInput
                    title="Dead to alive condition"
                    type="text"
                    value={localContext.deadToAliveCondition}
                    placeholder={localContext.deadToAliveCondition.toString()}
                    onChange={handleTextInputChange("deadToAliveCondition")}
                />

                <ControlPanelInput
                    title="Alive to alive condition"
                    type="text"
                    value={localContext.aliveToAliveCondition}
                    placeholder={localContext.aliveToAliveCondition.toString()}
                    onChange={handleTextInputChange("aliveToAliveCondition")}
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
