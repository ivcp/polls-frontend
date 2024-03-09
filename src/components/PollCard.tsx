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
import { IconPencil, IconX, IconDeviceFloppy } from '@tabler/icons-react';
import { EditPollBody } from '../types';
import { notifications } from '@mantine/notifications';
import pollService from '../services/polls';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const PollCard = ({ poll, details }: { poll: Poll; details: boolean }) => {
  const pollToken = Cookies.get(poll.id);

  const [editMode, setEditMode] = useState(false);
  const editRefs = useEdit();
  const navigate = useNavigate();

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

  const { mutate: mutatePoll } = useMutation({
    mutationFn: (editPollBody: EditPollBody) => {
      let token = '';
      if (pollToken !== undefined) {
        token = pollToken;
      }
      return pollService.editPoll(poll.id, editPollBody, token);
    },
    onError: (err) => {
      if (err.message.includes('|')) {
        const messages = err.message.split('|').slice(0, -1);
        messages.forEach((message) => {
          notifications.show({
            message: message,
            color: 'red',
          });
        });
        return;
      }
      notifications.show({
        message: err.message,
        color: 'red',
      });
    },
    onSuccess: () => {
      notifications.show({
        message: 'Saved!',
      });
    },
  });

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
      className={`${classes.container} ${details ? classes.noGap : ''}`}
      maw={details ? '45rem' : undefined}
      ml={details ? 'auto' : undefined}
      mr={details ? 'auto' : undefined}
      pt={details ? undefined : '3rem'}
    >
      {pollToken &&
        details &&
        (editMode ? (
          <ActionIcon
            pos="absolute"
            top={'1rem'}
            right={'1rem'}
            variant="transparent"
            onClick={() => navigate(0)}
          >
            <IconX />
          </ActionIcon>
        ) : (
          <ActionIcon
            pos="absolute"
            top={'1rem'}
            right={'1rem'}
            variant="transparent"
            onClick={() => setEditMode(() => true)}
          >
            <IconPencil />
          </ActionIcon>
        ))}
      <Card.Section>
        <Link to={`/${poll.id}`}>
          {details ? (
            editMode ? (
              <Group mb="sm" wrap="nowrap">
                <Input.Description>Question</Input.Description>
                <Textarea
                  autosize
                  rows={1}
                  defaultValue={poll.question}
                  ref={editRefs.questionRef}
                />
                <ActionIcon
                  onClick={() => {
                    const editPollBody: EditPollBody = {
                      question: editRefs.questionRef.current?.value,
                    };
                    if (editPollBody.question === poll.question) {
                      return;
                    }
                    mutatePoll(editPollBody);
                  }}
                >
                  <IconDeviceFloppy />
                </ActionIcon>
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
            <Group mb="sm" wrap="nowrap">
              <Input.Description>Description</Input.Description>
              <Textarea
                autosize
                rows={1}
                defaultValue={poll.description}
                ref={editRefs.descriptionRef}
              />
              <ActionIcon
                onClick={() => {
                  const editPollBody: EditPollBody = {
                    description: editRefs.descriptionRef.current?.value,
                  };
                  if (editPollBody.description === poll.description) {
                    return;
                  }
                  mutatePoll(editPollBody);
                }}
              >
                <IconDeviceFloppy />
              </ActionIcon>
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
            pollToken={pollToken}
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
                  placeholder={
                    poll.expires_at !== ''
                      ? 'change expiry time'
                      : 'set expiry time'
                  }
                  size="xs"
                  ref={editRefs.expiresRef}
                  clearable
                />
                <ActionIcon
                  onClick={() => {
                    const expTime = editRefs.expiresRef.current?.textContent;
                    const editPollBody: EditPollBody = {
                      expires_at: expTime
                        ? expTime !== 'set expiry time'
                          ? new Date(expTime).toISOString()
                          : undefined
                        : undefined,
                    };
                    if (editPollBody.expires_at === undefined) {
                      return;
                    }
                    mutatePoll(editPollBody);
                  }}
                >
                  <IconDeviceFloppy />
                </ActionIcon>
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
