import { Card, Text, Skeleton, ActionIcon, Group, Title } from '@mantine/core';
import { Poll } from '../services/polls';
import classes from './PollCard.module.css';
import { Link } from 'react-router-dom';
import { BarChart } from '@mantine/charts';
import PollForm from './PollForm';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import useVote from '../hooks/useVote';
import useResults from '../hooks/useResults';
import { checkExpired } from '../helpers';

const PollCard = ({ poll, details }: { poll: Poll; details: boolean }) => {
  const { vote, selectedOption, setSelectedOption } = useVote(poll.id);

  const {
    showResults,
    setShowResults,
    isResultsError,
    resultsError,
    isResultsSuccess,
    isResultsLoading,
    resultsData,
    refetchResults,
  } = useResults(poll.id);

  const voteBtnDisabled = checkExpired(poll);

  let chartHeight = 80;

  if (isResultsSuccess) {
    // @ts-expect-error: data is possibly undefined with custom hook
    resultsData.results.length > 2 &&
      // @ts-expect-error: data is possibly undefined with custom hook
      (chartHeight = 40 * (resultsData.results.length - 2) + 80);
  }
  const tickFormatter = (value: string) => {
    const limit = 18;
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  return (
    <Card
      shadow="sm"
      className={classes.container}
      maw={details ? '45rem' : undefined}
      ml={details ? 'auto' : undefined}
      mr={details ? 'auto' : undefined}
    >
      <Card.Section>
        <Link to={`/${poll.id}`}>
          {details ? (
            <Title order={2}>{poll.question}</Title>
          ) : (
            <Text fw={600}>{poll.question}</Text>
          )}
        </Link>
      </Card.Section>
      <Card.Section w={'100%'}>
        {!showResults ? (
          <PollForm
            poll={poll}
            voteBtnDisabled={voteBtnDisabled}
            refetchResults={refetchResults}
            selectedOption={selectedOption}
            vote={vote}
            setSelectedOption={setSelectedOption}
            setShowResults={setShowResults}
          />
        ) : (
          <div>
            {isResultsError && (
              <Text size="1.4rem" p={'lg'} ta={'center'}>
                {
                  // @ts-expect-error: data is possibly null with custom hook
                  resultsError.message
                }
              </Text>
            )}
            {isResultsLoading && (
              <>
                {poll.options.map((opt) => (
                  <Skeleton key={opt.id} height={35} radius="xl" mb={'xs'} />
                ))}
              </>
            )}
            {isResultsSuccess && (
              <BarChart
                h={chartHeight}
                withXAxis={false}
                tickLine="none"
                gridAxis="none"
                data={[
                  // @ts-expect-error: data is possibly undefined with custom hook
                  ...resultsData.results,
                ].sort((a, b) => a.position - b.position)}
                dataKey="value"
                series={[{ name: 'vote_count', color: 'blue.6' }]}
                orientation="vertical"
                barProps={{
                  radius: [0, 8, 8, 0],
                  label: { fill: '#eeeeee', fontSize: 14, fontWeight: 600 },
                }}
                withTooltip={false}
                yAxisProps={{ tickFormatter, tickSize: 0 }}
              />
            )}
          </div>
        )}
      </Card.Section>
      <Group gap={'4rem'}>
        {showResults && (
          <ActionIcon variant="light" onClick={() => setShowResults(false)}>
            <IconArrowNarrowLeft />
          </ActionIcon>
        )}
        <Link to={`/${poll.id}`}>
          <Text size="xs" className={classes.seeMore}>
            see more details
          </Text>
        </Link>
      </Group>
    </Card>
  );
};

export default PollCard;
