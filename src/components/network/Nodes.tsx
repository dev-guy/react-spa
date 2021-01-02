import React from 'react';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import CssBaseline from '@material-ui/core/CssBaseline';

import Loading from '../LoadingDots';
import Table from '../Table';
import communicatorState, { OptionalCommunicator } from '../../lib/communicatorState';

const columns = [
  {
    Header: 'Company',
    accessor: 'company',
  },
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
  {
    Header: 'Host Name',
    accessor: 'hostname',
  },
  {
    Header: 'IP Address',
    accessor: 'ip',
  },
  {
    Header: 'Local IP Address',
    accessor: 'local ip',
  },
  {
    Header: 'Port',
    accessor: 'port',
  },
];

const Nodes: React.FC = () => {
  const [communicator] = useRecoilState<OptionalCommunicator>(communicatorState);
  if (!communicator) throw new Error();

  const { data } = useQuery('nodes', () => communicator.nodes());

  if (!data) return <Loading />;

  return (
    <div>
      <CssBaseline />
      <Table columns={columns} data={data} />
    </div>
  );
};

export default Nodes;
