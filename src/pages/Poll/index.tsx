import PollCard from '../../components/PollCard';
import { PollResponse } from '../../types';
import { useLoaderData } from 'react-router-dom';

function Poll() {
  const { poll } = useLoaderData() as PollResponse;

  return <PollCard poll={poll} details={true} />;
}

export default Poll;
