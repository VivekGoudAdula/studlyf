import React, { Suspense } from 'react';
import Scene from '@/components/BSTVisualizer/Scene';
import ControlPanel from '@/components/BSTVisualizer/ControlPanel';
import OperationLog from '@/components/ArrayVisualizer/OperationLog';
import { useBSTOperations } from '@/components/BSTVisualizer/useBSTOperations';
import NavBar from '@/components/NavBar';

const BSTPage: React.FC = () => {
  const { flatNodes, logs, createBST, insert, deleteNode, search, clear } = useBSTOperations();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#090B1A]">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-white/70">Loading 3D scene...</div>}>
        <Scene flatNodes={flatNodes} />
      </Suspense>
      <NavBar />
      <div className="absolute top-20 left-6 z-10"><ControlPanel onCreateBST={createBST} onInsert={insert} onDelete={deleteNode} onSearch={search} onClear={clear} /></div>
      <div className="absolute top-20 right-6 z-10"><OperationLog logs={logs} /></div>
    </div>
  );
};

export default BSTPage;
