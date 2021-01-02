/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useQuery } from 'react-query';

import isDev from '../lib/isDev';
import Loading from './LoadingDots';

const QueryExample: React.FC = () => {
  const { data } = useQuery('queryExample', () => {
    let request: Request;
    const url = 'https://api.github.com/repos/tannerlinsley/react-query';

    if (isDev) {
      // Use CRA-provided proxy in development mode
      const headers = new Headers({
        'X-Forward': url,
      });

      request = new Request('/forward', {
        headers,
      });
    } else {
      request = new Request(url);
    }

    // Wait 5 seconds so Loading can kick in
    return new Promise((res) => setTimeout(res, 5000)).then(() => fetch(request)).then((res) => res.json());
  });

  if (!data) return <Loading />;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>
      <strong>✨ {data.stargazers_count}</strong>
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
};

export default QueryExample;
