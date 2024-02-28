import { useLoaderData } from 'react-router-dom';
import { PollResult } from './services/polls';

function PollDetails() {
  const { poll } = useLoaderData() as PollResult;

  return <div>{poll.question}</div>;
}

export default PollDetails;
