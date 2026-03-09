import React, { Suspense } from 'react';
import Scene from '@/components/StackVisualizer/Scene';
import ControlPanel from '@/components/StackVisualizer/ControlPanel';
import OperationLog from '@/components/ArrayVisualizer/OperationLog';
import { useStackOperations } from '@/components/StackVisualizer/useStackOperations';
import NavBar from '@/components/NavBar';

const StackPage: React.FC = () => {
  const { elements, logs, createStack, push, pop, peek, clear } = useStackOperations();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#090B1A]">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-white/70">Loading 3D scene...</div>}>
        <Scene elements={elements} />
      </Suspense>
      <NavBar />
      <div className="absolute top-20 left-6 z-10"><ControlPanel onCreateStack={createStack} onPush={push} onPop={pop} onPeek={peek} onClear={clear} /></div>
      <div className="absolute top-20 right-6 z-10"><OperationLog logs={logs} /></div>
    </div>
  );
};

export default StackPage;
