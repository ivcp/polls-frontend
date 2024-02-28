import { useQuery } from '@tanstack/react-query';
import pollService from './services/polls';

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
      {isSuccess && data.polls.map((poll) => <p key={poll.id}>{poll.id}</p>)}
    </div>
  );
}
