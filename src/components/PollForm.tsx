import {
  UseMutateFunction,
  RefetchOptions,
  QueryObserverResult,
} from '@tanstack/react-query';
import { Poll, VoteResults, VoteResponse } from '../types';
import {
  Stack,
  RadioGroup,
  Radio,
  Group,
  Tooltip,
  Button,
} from '@mantine/core';
import classes from './PollForm.module.css';

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
}: PollFormProps) => {
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
        ) : null}
      </Stack>
    </form>
  );
};

export default PollForm;
