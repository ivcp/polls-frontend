import {
  Card,
  Text,
  Skeleton,
  ActionIcon,
  Group,
  Title,
  Stack,
  Input,
  Textarea,
} from '@mantine/core';
import { Poll } from '../types';
import classes from './PollCard.module.css';
import { Link } from 'react-router-dom';
import { BarChart } from '@mantine/charts';
import PollForm from './PollForm';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import useVote from '../hooks/useVote';
import useResults from '../hooks/useResults';
import { checkExpired } from '../helpers';
import Cookies from 'js-cookie';
import { useState } from 'react';
import useEdit from '../hooks/useEdit';
import { DateTimePicker } from '@mantine/dates';
import { IconPencil, IconX } from '@tabler/icons-react';

const PollCard = ({ poll, details }: { poll: Poll; details: boolean }) => {
  const [editMode, setEditMode] = useState(false);

  const editRefs = useEdit();

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

  const pollToken = Cookies.get(poll.id);
  details && console.log(pollToken);

  return (
    <Card
      shadow="sm"
      className={`${classes.container} ${details ? classes.noGap : ''}`}
      maw={details ? '45rem' : undefined}
      ml={details ? 'auto' : undefined}
      mr={details ? 'auto' : undefined}
      pt={details ? undefined : '3rem'}
    >
      {pollToken !== undefined && details && (
        <ActionIcon
          pos="absolute"
          top={'1rem'}
          right={'1rem'}
          variant="transparent"
          onClick={() => setEditMode((prev) => !prev)}
        >
          {editMode ? <IconX /> : <IconPencil />}
        </ActionIcon>
      )}
      <Card.Section>
        <Link to={`/${poll.id}`}>
          {details ? (
            editMode ? (
              <Group mb="sm">
                <Input.Description>Question</Input.Description>
                <Textarea
                  defaultValue={poll.question}
                  ref={editRefs.questionRef}
                />
              </Group>
            ) : (
              <Title order={2}>{poll.question}</Title>
            )
          ) : (
            <Text fw={600}>{poll.question}</Text>
          )}
        </Link>
        {details &&
          (editMode ? (
            <Group mb="sm">
              <Input.Description>Description</Input.Description>
              <Textarea
                defaultValue={poll.description}
                ref={editRefs.descriptionRef}
              />
            </Group>
          ) : (
            <Text mt="sm" fs="italic">
              {poll.description}
            </Text>
          ))}
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
            details={details}
            editMode={editMode}
            editRefs={editRefs}
            pollToken={pollToken ? pollToken : ''}
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
                pr={details ? '1rem' : undefined}
                pl={details ? '1rem' : undefined}
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
        {details ? (
          <Stack gap={'0.1rem'} mt="2rem">
            <Text size="xs" c="dimmed">
              <strong>Created:</strong>{' '}
              {new Date(poll.created_at).toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed">
              <strong>Edited:</strong>{' '}
              {new Date(poll.created_at) < new Date(poll.updated_at)
                ? new Date(poll.updated_at).toLocaleString()
                : 'No'}
            </Text>
            {editMode ? (
              <Group>
                <Text size="xs" c="dimmed" fw="bold">
                  Expires:
                </Text>{' '}
                <DateTimePicker
                  valueFormat="DD MMM YYYY hh:mm A"
                  placeholder="set expiry time"
                  size="xs"
                  ref={editRefs.expiresRef}
                  clearable
                />
              </Group>
            ) : (
              <Text size="xs" c="dimmed">
                <strong>Expires:</strong>{' '}
                {poll.expires_at === ''
                  ? 'No'
                  : new Date(poll.expires_at).toLocaleString()}
              </Text>
            )}
          </Stack>
        ) : (
          <Link to={`/${poll.id}`}>
            <Text size="xs" className={classes.seeMore}>
              see more details
            </Text>
          </Link>
        )}
      </Group>
    </Card>
  );
};

export default PollCard;
