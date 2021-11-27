import { useState } from 'react';

import Header from './Header';
import TaskDiagram from './TaskDiagram';
import { defaultRunRecords, buildScopeTree } from '../lib/runRecord';
import { LogConfig } from '../lib/sclogs';

const defaultConfig: LogConfig = { makeDirectScopeTransparent: false };

const App = () => {
  const [records, setRecords] = useState(defaultRunRecords);
  const [config, setConfig] = useState(defaultConfig);

  return (
    <div className="container mx-auto px-4 h-screen flex flex-col">
      <div className="flex-none">
        <Header
          onRecordsUpdate={(data) => setRecords(data)}
          onConfigUpdate={(data) => setConfig(data)}
        />
      </div>
      <div className="flex-grow ">
        {/* <Visualize runRecords={records} /> */}
        <div className="flex flex-row justify-center">
          <TaskDiagram scopeTree={buildScopeTree(records)} visConfig={config} />
        </div>
      </div>
    </div>
  );
};

export default App;
