import {type SimulationContext} from "./types.ts";
import {type RefObject} from "react";

/**
 * Copies all values from source matrix to the context matrix
 */
const overwriteMatrix = (source: boolean[][], context: SimulationContext)=> {
    for (let i = 0; i < context.rows; i++) {
        for (let j = 0; j < context.columns; j++) {
            context.matrix[i][j] = source[i][j];
        }
    }
}

/**
 * Counts alive neighbors around a cell (excluding the cell itself)
 * Stops at the borders, so cells at borders will not get compared with cells on the other side of the matrix
 */
const countLivingNeighbours = (i: number, j: number, context: SimulationContext) => {
    let counter = 0;

    for (let i_ = Math.max(0, i-1); i_ < Math.min(i+2, context.rows); i_++) {
        for (let j_ = Math.max(0, j-1); j_ < Math.min(j+2, context.columns); j_++) {
            if (i_ == i && j_ == j) continue;  // ignore the original cell
            if (context.matrix[i_][j_]) counter++;
        }
    }
    return counter;
}

/**
 * Creates and initializes a matrix with random cell states
 *
 * @param aliveRatePerCell - Probability [0, 100] that a cell starts alive
 * @param rows - Number of rows
 * @param columns - Number of columns
 * @returns Initialized boolean matrix
 */
export const setupMatrix = (aliveRatePerCell: number, rows: number, columns: number) => {
    console.log(aliveRatePerCell)
    const matrix: boolean[][] = [];

    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < columns; j++) {
            matrix[i][j] = Math.random() * 100 < aliveRatePerCell;
        }
    }
    return matrix;
}

/**
 * Simulates one step of the cellular automaton by applying survival rules
 *
 * @param context - Simulation context containing current state and rules
 */
const simulateStep = (context: SimulationContext) => {
    const nextMatrix: boolean[][] = [];

    for (let i = 0; i < context.rows; i++) {
        nextMatrix[i] = [];

        for (let j = 0; j < context.columns; j++) {
            const cellIsAlive = context.matrix[i][j];
            const numberLivingNeighbours = countLivingNeighbours(i, j, context);

            if (cellIsAlive) {
                // if the cell is alive and the number of living neighbours is contained in aliveToAliveCondition, the
                // cell stays alive.
                nextMatrix[i][j] = context.aliveToAliveCondition.includes(numberLivingNeighbours.toString());
            } else {
                // if the cell is dead and the number of living neighbours is contained in deadToAliveCondition, the
                // cell becomes alive.
                nextMatrix[i][j] = context.deadToAliveCondition.includes(numberLivingNeighbours.toString());
            }
        }
    }
    overwriteMatrix(nextMatrix, context);
}

/**
 * Renders the current matrix state to a canvas
 *
 * @param canvas - HTML canvas element to draw on
 * @param simulationContext - Current simulation state
 */
export const drawMatrix = (canvas: HTMLCanvasElement, simulationContext: SimulationContext) => {
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) return;

    const cellSize = Math.floor(Math.min(
        canvas.height / simulationContext.rows,
        canvas.width / simulationContext.columns
    ))

    const offsetX = Math.floor((canvas.width - simulationContext.columns * cellSize) / 2);
    const offsetY = Math.floor((canvas.height - simulationContext.rows * cellSize) / 2);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < simulationContext.rows; row++) {
        for (let col = 0; col < simulationContext.columns; col++) {
            if (!simulationContext.matrix[row][col]) continue;

            const x = col * cellSize + offsetX;
            const y = row * cellSize + offsetY;

            canvasContext.fillStyle = "black";
            canvasContext.fillRect(x, y, cellSize, cellSize);
        }
    }
}

/**
 * Runs the simulation for the specified number of iterations
 *
 * @param canvas - HTML canvas element for rendering
 * @param context - Simulation configuration and state
 * @param isRunningRef - Ref to control simulation cancellation
 * @param onComplete - Callback executed when simulation finishes
 */
export const simulateSzenario = async (
    canvas: HTMLCanvasElement,
    context: SimulationContext,
    isRunningRef: RefObject<boolean>,
    onComplete: () => void
) => {
    for (let i = 0; i < context.numIterations && isRunningRef.current; i++) {
        simulateStep(context);
        drawMatrix(canvas, context);
        await new Promise(resolve => setTimeout(resolve, context.sleepDuration));
    }
    isRunningRef.current = false;
    onComplete();
}
