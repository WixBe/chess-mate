// app/page.tsx
import { Board } from '@/components/Board';

export default function Home() {
  return (
    <main className="min-h-screen p-24 flex flex-col items-center">
      <h1 className="text-4xl mb-8 font-bold">Gem Chess</h1>
      <div className="mb-4">Current Turn: White</div>
      <Board />
      <div className="mt-8 space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          New Game
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded">
          Undo Move
        </button>
      </div>
    </main>
  );
}