import {
  UseMutateFunction,
  RefetchOptions,
  QueryObserverResult,
} from '@tanstack/react-query';
import { Poll, Results, VoteResult } from '../../../services/polls';
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
  vote: UseMutateFunction<VoteResult, Error, string, unknown>;
  voteBtnDisabled: boolean;
  poll: Poll;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Results, Error>>;
};

const PollForm = ({
  selectedOption,
  vote,
  voteBtnDisabled,
  poll,
  setShowResults,
  setSelectedOption,
  refetch,
}: PollFormProps) => {
  const options = [...poll.options].sort((a, b) => a.position - b.position);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (selectedOption === '') return;
        vote(selectedOption);
      }}
    >
      <Stack gap={'1.5rem'}>
        <RadioGroup
          name={poll.question}
          className={classes.radioGroup}
          value={selectedOption}
          onChange={setSelectedOption}
        >
          {options.map((opt) => (
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
  );
};

export default PollForm;
