import type {SimulationContext} from "./types.ts";
import {setupMatrix} from "./simulation.ts";


export const DEFAULT_CONTEXT: SimulationContext = {
    rows: 100,
    columns: 200,
    initialAliveRate: 30,
    matrix: setupMatrix(30, 100, 200),
    numIterations: 100,
    aliveToAliveCondition: "2,3",
    deadToAliveCondition: "3",
    sleepDuration: 500,
}