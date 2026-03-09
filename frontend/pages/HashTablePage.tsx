import React, { Suspense } from 'react';
import Scene from '@/components/HashTableVisualizer/Scene';
import ControlPanel from '@/components/HashTableVisualizer/ControlPanel';
import OperationLog from '@/components/ArrayVisualizer/OperationLog';
import { useHashTableOperations } from '@/components/HashTableVisualizer/useHashTableOperations';
import NavBar from '@/components/NavBar';

const HashTablePage: React.FC = () => {
  const { buckets, logs, createTable, insert, deleteKey, search, clear } = useHashTableOperations();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#090B1A]">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-white/70">Loading 3D scene...</div>}>
        <Scene buckets={buckets} />
      </Suspense>
      <NavBar />
      <div className="absolute top-20 left-6 z-10"><ControlPanel onCreateTable={createTable} onInsert={insert} onDelete={deleteKey} onSearch={search} onClear={clear} /></div>
      <div className="absolute top-20 right-6 z-10"><OperationLog logs={logs} /></div>
    </div>
  );
};

export default HashTablePage;
