import React from 'react';
import { RecoilRoot } from 'recoil';

import ErrorHandler from './ErrorHandler';
import QueryRoot from './Root';

const App: React.FC = () => (
  <RecoilRoot>
    <ErrorHandler>
      <QueryRoot />
    </ErrorHandler>
  </RecoilRoot>
);

export default App;
