import { useState } from 'react';
import useResizeObserver from 'use-resize-observer';

import Header from './Header';
import TaskDiagram from './TaskDiagram';
import { buildScopeTree } from '../lib/scopeTree';
import defaultRunRecords from '../lib/defaultRecords';
import { LogConfig } from '../lib/validate';

const defaultConfig: LogConfig = { makeDirectScopeTransparent: false };

const App = () => {
  const [records, setRecords] = useState(defaultRunRecords);
  const [config, setConfig] = useState(defaultConfig);
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();

  const finalWidth = (width ?? 0) * 1;
  const finalHeight = (height ?? 0) * 0.8;
  return (
    <div className="container mx-auto px-4 h-screen flex flex-col">
      <div className="flex-none">
        <Header
          onRecordsUpdate={(data) => setRecords(data)}
          onConfigUpdate={(data) => setConfig(data)}
        />
      </div>
      <div ref={ref} className="h-screen flex-grow justify-center">
        <TaskDiagram
          scopeTree={buildScopeTree(records)}
          visConfig={config}
          width={finalWidth}
          height={finalHeight}
        />
      </div>
    </div>
  );
};

export default App;
