import {
  UseMutateFunction,
  RefetchOptions,
  QueryObserverResult,
  useMutation,
} from '@tanstack/react-query';
import { Poll, VoteResults, VoteResponse, EditPollBody } from '../types';
import {
  Stack,
  RadioGroup,
  Radio,
  Group,
  Tooltip,
  Button,
} from '@mantine/core';
import classes from './PollForm.module.css';
import { notifications } from '@mantine/notifications';

import pollService from '../services/polls';
import { useNavigate } from 'react-router-dom';

type PollFormProps = {
  selectedOption: string;
  vote: UseMutateFunction<VoteResponse, Error, void, unknown>;
  voteBtnDisabled: boolean;
  poll: Poll;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  refetchResults: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<VoteResults, Error>>;
  details: boolean;
  editMode: boolean;
  editRefs: {
    questionRef: React.RefObject<HTMLTextAreaElement>;
    descriptionRef: React.RefObject<HTMLTextAreaElement>;
    expiresRef: React.RefObject<HTMLButtonElement>;
  };
  pollToken: string;
};

const PollForm = ({
  selectedOption,
  vote,
  voteBtnDisabled,
  poll,
  setShowResults,
  setSelectedOption,
  refetchResults,
  details,
  editMode,
  editRefs,
  pollToken,
}: PollFormProps) => {
  const navigate = useNavigate();

  const { mutate: mutatePoll } = useMutation({
    mutationFn: (editPollBody: EditPollBody) =>
      pollService.editPoll(poll.id, editPollBody, pollToken),
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
      navigate(0);
      notifications.show({
        message: 'Poll edited',
      });
    },
  });

  const options = [...poll.options].sort((a, b) => a.position - b.position);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (selectedOption === '') return;
        vote();
      }}
    >
      <Stack gap={'1.5rem'}>
        <RadioGroup
          name={poll.question}
          className={classes.radioGroup}
          value={selectedOption}
          onChange={setSelectedOption}
          mt={details ? 'md' : undefined}
          mb={details ? 'md' : undefined}
        >
          {options.map((opt) => (
            <Radio
              key={opt.id}
              value={opt.id}
              label={opt.value}
              size={details ? 'md' : 'sm'}
            />
          ))}
        </RadioGroup>
        {!editMode ? (
          <Group
            justify={details ? 'space-evenly' : 'space-around'}
            mb={details ? 'xs' : undefined}
          >
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
                refetchResults();
                setShowResults(true);
              }}
            >
              Results
            </Button>
          </Group>
        ) : (
          <Button
            onClick={() => {
              const expTime = editRefs.expiresRef.current?.textContent;
              const editPollBody: EditPollBody = {
                question: editRefs.questionRef.current?.value,
                description: editRefs.descriptionRef.current?.value,
                expires_at: expTime
                  ? expTime !== 'set expiry time'
                    ? new Date(expTime).toISOString()
                    : undefined
                  : undefined,
              };
              mutatePoll(editPollBody);
            }}
          >
            Submit changes
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default PollForm;
