import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import pollService from '../../services/polls';
import PollCard from './components/PollCard';
import { Button, Grid, Pagination } from '@mantine/core';
import classes from './index.module.css';

export default function Polls() {
  const [activePage, setPage] = useState(1);

  const { isError, error, isSuccess, data } = useQuery({
    queryKey: ['polls', activePage],
    queryFn: pollService.listPolls.bind(null, activePage),
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
      {isSuccess && (
        <Pagination
          className={classes.pagination}
          total={data.metadata.last_page}
          value={activePage}
          onChange={setPage}
        ></Pagination>
      )}
    </div>
  );
}