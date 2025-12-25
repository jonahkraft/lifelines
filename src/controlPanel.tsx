import {type RefObject} from "react";
import {type SimulationContext} from "./types.ts";
import {ToggleSimulationButton} from "./toggleSimulationButton.tsx";


type ControlPanelProps = {
    canvasRef: RefObject<HTMLCanvasElement | null>,
    contextRef: RefObject<SimulationContext>,
    isRunningRef: RefObject<boolean>
}

const ControlPanel = ({canvasRef, contextRef, isRunningRef}: ControlPanelProps) => {
    return(
        <ToggleSimulationButton canvasRef={canvasRef} contextRef={contextRef} isRunningRef={isRunningRef}/>
    )
}

export default ControlPanel;
