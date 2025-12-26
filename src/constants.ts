import type {SimulationContext} from "./types.ts";
import {setupMatrix} from "./simulation.ts";


export const DEFAULT_CONTEXT: SimulationContext = {
    rows: 100,
    columns: 200,
    initialAliveRate: 0.3,
    matrix: setupMatrix(0.3, 100, 200),
    numIterations: 100,
    aliveToAliveCondition: [2, 3],
    deadToAliveCondition: [3],
    sleepDuration: 500,
}