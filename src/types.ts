/**
 * Interface for the simulation context
 *
 * @param initialAliveRate must be in [0.0, 1.0]
 * @param deadToAliveCondition can contain numbers between 0 and 8 separated by any character
 * @param aliveToAliveCondition can contain numbers between 0 and 8 separated by any character
 * @param sleepDuration time in ms
 */
export interface SimulationContext {
    rows: number,
    columns: number,
    initialAliveRate: number,
    matrix: boolean[][],
    numIterations: number,
    deadToAliveCondition: string,
    aliveToAliveCondition: string,
    sleepDuration: number,
}