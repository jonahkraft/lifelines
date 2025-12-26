/**
 * Interface for the simulation context
 *
 * @param initialAliveRate must be in [0.0, 1.0]
 * @param deadToAliveCondition can contain ints between 0 and 8
 * @param aliveToAliveCondition can contain ints between 0 and 8
 * @param sleepDuration time in ms
 */
export interface SimulationContext {
    rows: number,
    columns: number,
    initialAliveRate: number,
    matrix: boolean[][],
    numIterations: number,
    deadToAliveCondition: number[],
    aliveToAliveCondition: number[],
    sleepDuration: number,
}