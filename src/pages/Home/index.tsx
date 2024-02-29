import { useQuery } from '@tanstack/react-query';
import pollService from '../../services/polls';
import PollCard from './components/PollCard';
import { Button, SimpleGrid } from '@mantine/core';
import classes from './index.module.css';

export default function Polls() {
  const { isError, error, isSuccess, data } = useQuery({
    queryKey: ['polls'],
    queryFn: pollService.listPolls,
  });

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <p>Create a poll and share with others.</p>
        <Button size="lg">Create poll</Button>
      </div>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {isSuccess &&
          data.polls.map((poll) => <PollCard key={poll.id} poll={poll} />)}
      </SimpleGrid>
    </div>
  );
}
