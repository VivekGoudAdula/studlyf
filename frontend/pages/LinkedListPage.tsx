import React, { Suspense } from 'react';
import Scene from '@/components/LinkedListVisualizer/Scene';
import ControlPanel from '@/components/LinkedListVisualizer/ControlPanel';
import OperationLog from '@/components/ArrayVisualizer/OperationLog';
import { useLinkedListOperations } from '@/components/LinkedListVisualizer/useLinkedListOperations';
import NavBar from '@/components/NavBar';

const LinkedListPage: React.FC = () => {
  const { nodes, logs, createList, insertHead, insertTail, insertAt, deleteHead, deleteTail, search, clear } = useLinkedListOperations();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#090B1A]">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-white/70">Loading 3D scene...</div>}>
        <Scene nodes={nodes} />
      </Suspense>
      <NavBar />
      <div className="absolute top-20 left-6 z-10"><ControlPanel onCreateList={createList} onInsertHead={insertHead} onInsertTail={insertTail} onInsertAt={insertAt} onDeleteHead={deleteHead} onDeleteTail={deleteTail} onSearch={search} onClear={clear} /></div>
      <div className="absolute top-20 right-6 z-10"><OperationLog logs={logs} /></div>
    </div>
  );
};

export default LinkedListPage;
