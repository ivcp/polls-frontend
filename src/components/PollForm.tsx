import {
  UseMutateFunction,
  RefetchOptions,
  QueryObserverResult,
} from '@tanstack/react-query';
import { Poll, Results, VoteResult } from '../services/polls';
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
  vote: UseMutateFunction<VoteResult, Error, void, unknown>;
  voteBtnDisabled: boolean;
  poll: Poll;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  refetchResults: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Results, Error>>;
  details: boolean;
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
      </Stack>
    </form>
  );
};

export default PollForm;
