import React from 'react';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import CssBaseline from '@material-ui/core/CssBaseline';

import Table from '../Table';
import communicatorState, { OptionalCommunicator } from '../../lib/communicatorState';

const columns = [
  {
    Header: 'Cluster',
    accessor: 'cluster',
  },
  {
    Header: 'Type',
    accessor: 'type',
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
];

const Nodes: React.FC = () => {
  const [communicator] = useRecoilState<OptionalCommunicator>(communicatorState);
  if (!communicator) throw new Error();

  const { isLoading, error, data } = useQuery('nodes', () => communicator.nodes());

  if (isLoading) return <></>;

  if (error) throw error;
  if (!data) throw new Error();

  return (
    <>
      <CssBaseline />
      <Table columns={columns} data={data} />
    </>
  );
};

export default Nodes;
