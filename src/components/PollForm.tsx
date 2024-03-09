import {
  UseMutateFunction,
  RefetchOptions,
  QueryObserverResult,
  useMutation,
} from '@tanstack/react-query';
import { Poll, VoteResults, VoteResponse, UpdateOptionBody } from '../types';
import {
  Stack,
  RadioGroup,
  Radio,
  Group,
  Tooltip,
  Button,
  Textarea,
  InputLabel,
  ActionIcon,
} from '@mantine/core';
import classes from './PollForm.module.css';
import { IconDeviceFloppy } from '@tabler/icons-react';
import pollService from '../services/polls';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

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
  pollToken: string | undefined;
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
  pollToken,
}: PollFormProps) => {
  const [editOptions, setEditOptions] = useState<
    Map<
      string,
      {
        value: string;
        position: number;
      }
    >
  >(() => {
    return new Map<
      string,
      {
        value: string;
        position: number;
      }
    >(
      Array.from(poll.options, (o) => [
        o.id,
        { value: o.value, position: o.position },
      ])
    );
  });

  const { mutate: mutateOptionValue } = useMutation({
    mutationFn: (v: { optionID: string; body: UpdateOptionBody }) => {
      let token = '';
      if (pollToken !== undefined) {
        token = pollToken;
      }
      return pollService.updateOptionValue(poll.id, v.optionID, v.body, token);
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
          {options.map((opt) =>
            editMode ? (
              <Group key={opt.id}>
                <InputLabel>{opt.position + 1}</InputLabel>
                <Textarea
                  rows={1}
                  autosize
                  value={editOptions.get(opt.id)?.value}
                  onChange={(e) => {
                    setEditOptions((prev) =>
                      new Map(prev).set(opt.id, {
                        value: e.target.value,
                        position: opt.position,
                      })
                    );
                  }}
                />
                <ActionIcon
                  onClick={() => {
                    const body: UpdateOptionBody = {
                      value: editOptions.get(opt.id)?.value,
                    };
                    const oldOpt = poll.options.find((o) => o.id === opt.id);
                    if (body.value === oldOpt?.value) return;
                    mutateOptionValue({ optionID: opt.id, body: body });
                  }}
                >
                  <IconDeviceFloppy />
                </ActionIcon>
              </Group>
            ) : (
              <Radio
                key={opt.id}
                value={opt.id}
                label={opt.value}
                size={details ? 'md' : 'sm'}
              />
            )
          )}
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
