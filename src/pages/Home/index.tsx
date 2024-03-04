import { useQuery } from '@tanstack/react-query';
import pollService from '../../services/polls';
import PollCard from './components/PollCard';
import { Button, Grid } from '@mantine/core';
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
      <Grid>
        {isSuccess &&
          data.polls.map((poll) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={poll.id}>
              <PollCard poll={poll} />
            </Grid.Col>
          ))}
      </Grid>
    </div>
  );
}
