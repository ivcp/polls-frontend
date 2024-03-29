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
  Button,
  Modal,
  Box,
} from '@mantine/core';
import { Poll } from '../types';
import classes from './PollCard.module.css';
import { Link } from 'react-router-dom';
import { BarChart } from '@mantine/charts';
import PollForm from './PollForm';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import useVote from '../hooks/useVote';
import useResults from '../hooks/useResults';
import { checkExpired, mutationError, pollEditSuccess } from '../helpers';
import Cookies from 'js-cookie';
import { useState } from 'react';
import useEdit from '../hooks/useEdit';
import { DateTimePicker } from '@mantine/dates';
import { IconPencil, IconX, IconDeviceFloppy } from '@tabler/icons-react';
import { EditPollBody } from '../types';
import pollService from '../services/polls';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { useMeasure } from '@uidotdev/usehooks';

const PollCard = ({ poll, details }: { poll: Poll; details: boolean }) => {
  const pollToken = Cookies.get(poll.id);
  const [editMode, setEditMode] = useState(false);
  const editRefs = useEdit();
  const navigate = useNavigate();

  const [isModalOpen, { open: openModal, close: closeModal }] =
    useDisclosure(false);

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

  const { mutate: updatePoll } = useMutation({
    mutationFn: (editPollBody: EditPollBody) => {
      let token = '';
      if (pollToken !== undefined) {
        token = pollToken;
      }
      return pollService.editPoll(poll.id, editPollBody, token);
    },
    onError: mutationError,
    onSuccess: pollEditSuccess.bind(null, 'Saved!'),
  });

  const { mutate: deletePoll } = useMutation({
    mutationFn: () => {
      let token = '';
      if (pollToken !== undefined) {
        token = pollToken;
      }
      return pollService.deletePoll(poll.id, token);
    },
    onError: mutationError,
    onSuccess: () => navigate('/'),
  });

  const voteBtnDisabled = checkExpired(poll);

  const [formRef, { height: formHeight }] = useMeasure();

  let chartHeight = details ? 100 : 80;
  const chartContainerHeight = formHeight;
  if (isResultsSuccess) {
    // @ts-expect-error: data is possibly undefined with custom hook
    if (resultsData.results.length > 2) {
      // @ts-expect-error: data is possibly undefined with custom hook
      chartHeight = 40 * (resultsData.results.length - 2) + chartHeight;
    }
  }
  const tickFormatter = (value: string) => {
    const limit = 18;
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  return (
    <Card
      withBorder
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
                  updatePoll(editPollBody);
                }}
              >
                <IconDeviceFloppy />
              </ActionIcon>
            </Group>
          ) : (
            <Title order={2} ta="center">
              {poll.question}
            </Title>
          )
        ) : (
          <Link to={`/${poll.id}`}>
            <Text fw={600}>{poll.question}</Text>
          </Link>
        )}
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
                  updatePoll(editPollBody);
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
            formRef={formRef}
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
        ) : editMode ? (
          <PollForm
            formRef={formRef}
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
          <Box
            h={chartContainerHeight !== null ? chartContainerHeight : undefined}
          >
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
                  <Skeleton key={opt.id} height={35} radius="xl" mb={'md'} />
                ))}
              </>
            )}
            {isResultsSuccess && (
              <BarChart
                pt={details ? 'md' : undefined}
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
                //  barChartProps={{ barCategoryGap: 20 }}
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
          </Box>
        )}
      </Card.Section>
      <Group gap={'4rem'}>
        {showResults && !editMode && (
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
                    updatePoll(editPollBody);
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
            <Text size="xs" h={'28'} pt="5" className={classes.seeMore}>
              see more details
            </Text>
          </Link>
        )}
      </Group>
      {editMode && (
        <Button
          mt={'2rem'}
          color="red.6"
          size="compact-md"
          onClick={() => {
            openModal();
          }}
        >
          Delete poll
        </Button>
      )}
      <Modal opened={isModalOpen} onClose={closeModal}>
        <Stack align="center">
          <Text>Are you sure you want to delete this poll?</Text>
          <Group>
            <Button
              onClick={() =>
                deletePoll(undefined, {
                  onSuccess: () => pollEditSuccess('Poll deleted!'),
                })
              }
            >
              Yes
            </Button>
            <Button variant="light" onClick={closeModal}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
};

export default PollCard;
