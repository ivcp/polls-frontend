import {
  Card,
  Stack,
  Text,
  Radio,
  RadioGroup,
  Button,
  Group,
  Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import pollService, { Poll } from '../../../services/polls';
import classes from './PollCard.module.css';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { BarChart } from '@mantine/charts';

const PollCard = ({ poll }: { poll: Poll }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [showResults, setShowResults] = useState(false);

  const mutation = useMutation({
    mutationFn: (optionID: string) => pollService.vote(poll.id, optionID),
    onError: (err) =>
      notifications.show({
        message: err.message.charAt(0).toUpperCase() + err.message.slice(1),
        color: 'red',
      }),
    onSuccess: (data) =>
      notifications.show({
        message: data.message.charAt(0).toUpperCase() + data.message.slice(1),
      }),
  });

  const {
    isError: isResultsError,
    error: resultsError,
    isSuccess: isResultsSuccess,
    data: resultsData,
    refetch,
  } = useQuery({
    queryKey: ['results', poll.id],
    queryFn: pollService.getResults.bind(null, poll.id),
    enabled: false,
  });

  const expiresSet = poll.expires_at !== '';
  let voteBtnDisabled = false;
  if (expiresSet) {
    const date = new Date(poll.expires_at);
    if (date < new Date()) {
      voteBtnDisabled = true;
    }
  }

  let chartHeight = 80;

  if (isResultsSuccess) {
    resultsData.results.length > 2 &&
      (chartHeight = 40 * (resultsData.results.length - 2) + 80);
  }
  const tickFormatter = (value: string) => {
    const limit = 18;
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  return (
    <Card shadow="sm" className={classes.container}>
      <Card.Section>
        <Link to={`/${poll.id}`}>
          <Text fw={600}>{poll.question}</Text>
        </Link>
      </Card.Section>
      <Card.Section w={'100%'}>
        {!showResults ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedOption === '') return;
              mutation.mutate(selectedOption);
            }}
          >
            <Stack gap={'1.5rem'}>
              <RadioGroup
                name={poll.question}
                className={classes.radioGroup}
                value={selectedOption}
                onChange={setSelectedOption}
              >
                {poll.options.map((opt) => (
                  <Radio key={opt.id} value={opt.id} label={opt.value} />
                ))}
              </RadioGroup>
              <Group justify={'space-around'}>
                {voteBtnDisabled ? (
                  <Tooltip label="Poll has expired">
                    <Button
                      type="submit"
                      data-disabled
                      onClick={(e) => e.preventDefault()}
                    >
                      Vote
                    </Button>
                  </Tooltip>
                ) : (
                  <Button type="submit">Vote</Button>
                )}
                <Button
                  variant={'light'}
                  onClick={() => {
                    refetch();
                    setShowResults(true);
                  }}
                >
                  Results
                </Button>
              </Group>
            </Stack>
          </form>
        ) : (
          <div>
            <p className={classes.close} onClick={() => setShowResults(false)}>
              &#8592;
            </p>
            {isResultsError && <p>{resultsError.message}</p>}
            {isResultsSuccess && (
              <BarChart
                h={chartHeight}
                withXAxis={false}
                tickLine="none"
                gridAxis="none"
                data={resultsData.results}
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
      <Link to={`/${poll.id}`}>
        <Text size="xs" className={classes.seeMore}>
          see more details
        </Text>
      </Link>
    </Card>
  );
};

export default PollCard;
