import { useQuery } from '@tanstack/react-query';
import pollService from '../../services/polls';
import PollCard from './components/PollCard';

export default function Polls() {
  const { isError, error, isSuccess, data } = useQuery({
    queryKey: ['polls'],
    queryFn: pollService.listPolls,
  });

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      <div>
        <h1>Title</h1>
        <button>Create poll</button>
      </div>
      {isSuccess &&
        data.polls.map((poll) => <PollCard key={poll.id} poll={poll} />)}
    </div>
  );
}
