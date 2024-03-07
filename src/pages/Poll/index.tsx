import PollCard from '../../components/PollCard';
import { PollResult } from '../../types';
import { useLoaderData } from 'react-router-dom';

function Poll() {
  const { poll } = useLoaderData() as PollResult;

  return <PollCard poll={poll} details={true} />;
}

export default Poll;
