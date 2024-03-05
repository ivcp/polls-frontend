import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import pollService from '../../services/polls';
import PollCard from './components/PollCard';
import { Button, Grid, Pagination, Skeleton } from '@mantine/core';
import classes from './index.module.css';
import { Link } from 'react-router-dom';

export default function Polls() {
  const [activePage, setPage] = useState(1);
  const { isError, isLoading, error, isSuccess, data } = useQuery({
    queryKey: ['polls', activePage],
    queryFn: pollService.listPolls.bind(null, activePage),
  });

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <p>Create a poll and share with others.</p>
        <Button component={Link} to={'/new'} size="lg">
          Create poll
        </Button>
      </div>
      <Grid>
        {isLoading && (
          <>
            {[...Array(12)].map((_, i) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={i}>
                <Skeleton height={300} width={300} radius="sm" m={20} />
              </Grid.Col>
            ))}
          </>
        )}
        {isError && <p>Error: {error.message}</p>}
        {isSuccess && data.polls.length === 0 && (
          <p>There are currently no polls. Be the first to create one!</p>
        )}
        {isSuccess &&
          data.polls.map((poll) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={poll.id}>
              <PollCard poll={poll} />
            </Grid.Col>
          ))}
      </Grid>
      {isSuccess && data.polls.length > 0 && (
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
