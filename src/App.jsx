import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Tile from "./components/tile.component";
import { findLastIdx } from "./utils/array.util";

const MOVE = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
};

function App() {
  const [gameState, setGameState] = useState("PLAY");
  const [shouldGenerateNewTile, setShouldGenerateNewTile] = useState(false);
  const [grid, setGrid] = useState([
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [2, 2, null, null],
  ]);

  const [gridState, setGridState] = useState([]);

  const emptyTiles = useMemo(() => {
    const _emptyTiles = [];
    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
      const row = grid[rowIdx];
      for (let tileIdx = 0; tileIdx < row.length; tileIdx++) {
        if (!grid[rowIdx][tileIdx]) _emptyTiles.push([rowIdx, tileIdx]);
      }
    }

    return _emptyTiles;
  }, [grid]);

  const currentScore = useMemo(() => {
    let max = grid[0][0] || 0;
    for (const row of grid) {
      max = Math.max(max, ...row);
    }

    return max;
  }, [grid]);

  const highestScore = localStorage.getItem("highest_score") || 0;

  const generateNewTile = useCallback(() => {
    if (emptyTiles.length === 0) {
      setGameState("LOSE");
      localStorage.setItem("highest_score", currentScore);
    }

    const selectedEmptyTileIdx = Math.floor(Math.random() * emptyTiles.length);
    const newTilePosition = emptyTiles[selectedEmptyTileIdx];
    if (!newTilePosition) return;

    const newGrid = grid.map((row, rowIdx) =>
      row.map((tile, tileIdx) => {
        if (rowIdx === newTilePosition[0] && tileIdx === newTilePosition[1])
          return 2;

        return tile;
      })
    );
    setGrid(newGrid);
    localStorage.setItem("last_state", JSON.stringify(newGrid));
  }, [currentScore, emptyTiles, grid]);

  const handleMoveRight = useCallback(() => {
    const newGrid = grid.map((r) => r.map((t) => t));
    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
      const row = newGrid[rowIdx];
      for (let idx = row.length - 1; idx >= 0; idx--) {
        let tileIdx = idx;
        const currTile = newGrid[rowIdx][tileIdx];
        let furtherEmptyIdx = findLastIdx(row, (el) => el === null);
        if (!currTile) continue;

        if (tileIdx < furtherEmptyIdx) {
          newGrid[rowIdx][furtherEmptyIdx] = currTile;
          newGrid[rowIdx][tileIdx] = null;
          tileIdx = furtherEmptyIdx;
        }

        let prevIdx = tileIdx - 1;
        while (!newGrid[rowIdx][prevIdx] && prevIdx >= 0) {
          prevIdx--;
        }

        if (newGrid[rowIdx][tileIdx] === newGrid[rowIdx][prevIdx]) {
          newGrid[rowIdx][tileIdx] = 2 * newGrid[rowIdx][tileIdx];
          newGrid[rowIdx][prevIdx] = null;
        }
      }
    }

    setGrid(newGrid);
  }, [grid]);

  const handleMoveLeft = useCallback(() => {
    const newGrid = grid.map((r) => r.map((t) => t));
    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
      const row = newGrid[rowIdx];
      for (let idx = 0; idx < row.length; idx++) {
        let tileIdx = idx;
        const currTile = newGrid[rowIdx][tileIdx];
        let furtherEmptyIdx = row.findIndex((el) => el === null);
        if (!currTile) continue;

        if (tileIdx > furtherEmptyIdx && furtherEmptyIdx > -1) {
          newGrid[rowIdx][furtherEmptyIdx] = currTile;
          newGrid[rowIdx][tileIdx] = null;
          tileIdx = furtherEmptyIdx;
        }

        let prevIdx = tileIdx + 1;
        while (!newGrid[rowIdx][prevIdx] && prevIdx < row.length) {
          prevIdx++;
        }

        if (newGrid[rowIdx][tileIdx] === newGrid[rowIdx][prevIdx]) {
          newGrid[rowIdx][tileIdx] = 2 * newGrid[rowIdx][tileIdx];
          newGrid[rowIdx][prevIdx] = null;
        }
      }
    }

    setGrid(newGrid);
  }, [grid]);

  const handleMoveUp = useCallback(() => {
    const newGrid = grid.map((r) => r.map((t) => t));
    for (let colIdx = 0; colIdx < grid.length; colIdx++) {
      for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
        const col = [
          newGrid[0][colIdx],
          newGrid[1][colIdx],
          newGrid[2][colIdx],
          newGrid[3][colIdx],
        ];

        let tileIdx = rowIdx;
        const currTile = newGrid[tileIdx][colIdx];
        if (!currTile) continue;

        let furtherEmptyIdx = col.findIndex((el) => el === null);
        if (tileIdx > furtherEmptyIdx && furtherEmptyIdx > -1) {
          newGrid[furtherEmptyIdx][colIdx] = currTile;
          newGrid[tileIdx][colIdx] = null;
          tileIdx = furtherEmptyIdx;
        }

        let prevIdx = tileIdx + 1;
        while (prevIdx < col.length && !newGrid[prevIdx][colIdx]) {
          prevIdx++;
        }
        if (prevIdx >= col.length) continue;

        if (newGrid[tileIdx][colIdx] === newGrid[prevIdx][colIdx]) {
          newGrid[tileIdx][colIdx] = 2 * newGrid[tileIdx][colIdx];
          newGrid[prevIdx][colIdx] = null;
        }
      }
    }

    setGrid(newGrid);
  }, [grid]);

  const handleMoveDown = useCallback(() => {
    const newGrid = grid.map((r) => r.map((t) => t));
    for (let colIdx = 0; colIdx < grid.length; colIdx++) {
      console.log("=========== COL", colIdx + 1, "=============");
      for (let rowIdx = grid.length - 1; rowIdx >= 0; rowIdx--) {
        const col = [
          newGrid[0][colIdx],
          newGrid[1][colIdx],
          newGrid[2][colIdx],
          newGrid[3][colIdx],
        ];

        let tileIdx = rowIdx;
        const currTile = newGrid[tileIdx][colIdx];
        if (!currTile) continue;

        let furtherEmptyIdx = findLastIdx(col, (el) => el === null);
        if (tileIdx < furtherEmptyIdx && furtherEmptyIdx < grid.length) {
          console.log("col", col);
          console.log("update tileIdx", tileIdx, furtherEmptyIdx);
          newGrid[furtherEmptyIdx][colIdx] = currTile;
          newGrid[tileIdx][colIdx] = null;
          tileIdx = furtherEmptyIdx;
        }

        let prevIdx = tileIdx - 1;
        while (prevIdx > -1 && !newGrid[prevIdx][colIdx]) {
          prevIdx--;
        }
        if (prevIdx < 0) continue;

        console.log("furtherEmptyIdx", furtherEmptyIdx);
        console.log("IDX", tileIdx, prevIdx);
        if (newGrid[tileIdx][colIdx] === newGrid[prevIdx][colIdx]) {
          newGrid[tileIdx][colIdx] = 2 * newGrid[tileIdx][colIdx];
          newGrid[prevIdx][colIdx] = null;
        }
      }
    }

    setGrid(newGrid);
  }, [grid]);

  const handleMove = useCallback(
    (e) => {
      if (!Object.values(MOVE).includes(e.key)) return;
      if (gameState === "WIN") return;

      setGridState((prev) => [...prev, grid]);
      if (e.key === MOVE.RIGHT) handleMoveRight();
      else if (e.key === MOVE.LEFT) handleMoveLeft();
      else if (e.key === MOVE.UP) handleMoveUp();
      else if (e.key === MOVE.DOWN) handleMoveDown();

      setShouldGenerateNewTile(true);
    },
    [
      gameState,
      grid,
      handleMoveDown,
      handleMoveLeft,
      handleMoveRight,
      handleMoveUp,
    ]
  );

  // For registering move event
  useEffect(() => {
    document.addEventListener("keydown", handleMove);

    return () => {
      document.removeEventListener("keydown", handleMove);
    };
  }, [handleMove]);

  // For generating new tile
  useEffect(() => {
    if (shouldGenerateNewTile) {
      generateNewTile();
      setShouldGenerateNewTile(false);
    }
  }, [generateNewTile, shouldGenerateNewTile]);

  const handleRestartGame = () => {
    setGameState("PLAY");
    setGrid([
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [2, 2, null, null],
    ]);
  };

  useEffect(() => {
    if (currentScore >= 2048) {
      setGameState("WIN");
      localStorage.setItem("highest_score", currentScore);
    }
  }, [currentScore]);

  // Resume game
  useEffect(() => {
    const lastStateStr = localStorage.getItem("last_state");
    if (lastStateStr) setGrid(JSON.parse(lastStateStr));
  }, []);

  const handleUndo = () => {
    const undoStack = [...gridState];
    const prevState = undoStack.pop();

    console.log("prevState", prevState);
    if (prevState) {
      setGrid(prevState);
      setGridState(undoStack);
    }
  };

  console.log("grid state", gridState);

  const totalScore = useMemo(() => {
    let total = 0;
    for (const row of grid) {
      total += row.reduce((total, curr) => total + (curr || 0), 0);
    }

    return total;
  }, [grid]);

  useEffect(() => {
    if (['WIN', 'LOSE'].includes(gameState)) {
      localStorage.removeItem("last_state");
    }
  }, [gameState]);

  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center gap-6">
      <div className="flex justify-between gap-24">
        <div className="flex items-center flex-col gap-1">
          <h3 className="text-lg font-medium">Current Score</h3>
          <h1 className="text-5xl font-extrabold">{currentScore}</h1>
        </div>
        <div className="flex items-center flex-col gap-1">
          <h3 className="text-lg font-medium">Total Score</h3>
          <h1 className="text-5xl font-extrabold">{totalScore}</h1>
        </div>
        <div className="flex items-center flex-col gap-1">
          <h3 className="text-lg font-medium">Highest Score</h3>
          <h1 className="text-5xl font-extrabold">
            {Math.max(highestScore, currentScore)}
          </h1>
        </div>
      </div>
      {gameState === "WIN" && (
        <div className="font-semibold text-white bg-green-700 text-xl rounded-md p-4">
          Congratulations, You win the game!
        </div>
      )}
      {gameState === "LOSE" && (
        <div className="font-medium text-white p-4 rounded-md bg-red-600 text-xl">
          Sorry, You lose the game!
        </div>
      )}
      <div className="flex items-start justify-center gap-6">
        <button
          className="px-6 py-3 font-semibold rounded-md text-white bg-orange-600 hover:bg-orange-700"
          onClick={handleUndo}
        >
          Undo
        </button>
        <button
          className="px-6 py-3 font-semibold rounded-md bg-amber-500 hover:bg-amber-600 text-white"
          onClick={handleRestartGame}
        >
          Retry
        </button>
      </div>
      <div className="flex flex-col rounded-lg bg-slate-300 p-4 gap-4">
        {grid.map((row, rowIdx) => (
          <div className="flex gap-4" key={rowIdx}>
            {row.map((tile, idx) => (
              <Tile key={idx} value={tile} />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
