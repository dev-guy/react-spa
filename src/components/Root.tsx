import React, { Suspense } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientProvider } from 'react-query';
import { useRecoilState } from 'recoil';

import Header from './Header';
import Routes from './Routes';
import qc from '../lib/queryClient';
import communicatorState from '../lib/communicatorState';
import Loading from './LoadingDots';

const Root: React.FC = () => {
  const [communicator] = useRecoilState(communicatorState);
  const queryClient = communicator ? communicator.queryClient : qc();

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loading />}>
        <Header />
        <Routes />
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Root;
