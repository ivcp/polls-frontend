import {
  UseMutateFunction,
  RefetchOptions,
  QueryObserverResult,
} from '@tanstack/react-query';
import {
  Poll,
  VoteResults,
  VoteResponse,
  UpdateOptionBody,
  UpdateOptionsPositionsBody,
} from '../types';
import {
  Stack,
  RadioGroup,
  Radio,
  Group,
  Tooltip,
  Button,
  Textarea,
  ActionIcon,
} from '@mantine/core';
import classes from './PollForm.module.css';
import {
  IconDeviceFloppy,
  IconGripVertical,
  IconTrash,
} from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useListState } from '@mantine/hooks';
import useUpdateOptions from '../hooks/useUpdateOptions';
import { useDisclosure } from '@mantine/hooks';
import { useRef, useState } from 'react';
import { useRevalidator } from 'react-router-dom';

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
  formRef: (instance: Element | null) => void;
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
  formRef,
}: PollFormProps) => {
  const [optionsList, optionListHandlers] = useListState(
    [...poll.options].sort((a, b) => a.position - b.position)
  );
  const [addOptionOpen, { toggle: toggleAddOption }] = useDisclosure(false);

  const { updateOptionValue, updateOptionPositions, addOption, deleteOption } =
    useUpdateOptions(pollToken, poll);

  const addOptionRef = useRef<HTMLTextAreaElement>(null);

  const revalidator = useRevalidator();

  const [isPositionChange, setIsPositionChange] = useState(false);

  if (optionsList.length !== poll.options.length) {
    if (optionsList.length > poll.options.length) {
      optionListHandlers.setState(
        [...poll.options].sort((a, b) => a.position - b.position)
      );
    } else {
      const newOption = poll.options.find(
        (o) => o.position === optionsList.length
      );
      newOption &&
        optionListHandlers.append({
          id: newOption.id,
          value: newOption.value,
          position: newOption.position,
        });
    }
  }

  if (isPositionChange) {
    const changedPosition = optionsList.reduce(
      (acc, cur, i) => {
        if (cur.position !== i) {
          acc.push({ ...cur, position: i });
          return acc;
        }
        return acc;
      },
      [] as {
        id: string;
        value: string;
        position: number;
      }[]
    );
    const body: UpdateOptionsPositionsBody = {
      options: changedPosition.map((opt) => ({
        id: opt.id,
        position: opt.position,
      })),
    };
    updateOptionPositions(body, {
      onSuccess: () => {
        optionListHandlers.applyWhere(
          (opt, i) => opt.position !== i,
          (opt, i) => {
            if (i === undefined) return { ...opt };
            return {
              id: opt.id,
              value: opt.value,
              position: i,
            };
          }
        );
      },
    });

    setIsPositionChange(false);
  }

  return (
    <form
      ref={formRef}
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
          <DragDropContext
            onDragEnd={({ source, destination }) => {
              if (
                destination?.index !== undefined &&
                destination?.index !== source.index
              ) {
                optionListHandlers.reorder({
                  from: source.index,
                  to: destination.index,
                });
                setIsPositionChange(true);
              }
            }}
          >
            <Droppable droppableId="dnd-list" direction="vertical">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {optionsList.map((opt, index) =>
                    editMode ? (
                      <Draggable
                        key={opt.id}
                        index={index}
                        draggableId={opt.id}
                      >
                        {(provided) => (
                          <Group
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            wrap="nowrap"
                          >
                            <IconGripVertical className={classes.grip} />
                            <Textarea
                              rows={1}
                              autosize
                              value={opt.value}
                              onChange={(e) => {
                                optionListHandlers.setItemProp(
                                  opt.position,
                                  'value',
                                  e.target.value
                                );
                              }}
                            />
                            <Group align="baseline" wrap="nowrap">
                              <ActionIcon
                                onClick={() => {
                                  const body: UpdateOptionBody = {
                                    value: opt.value,
                                  };
                                  const oldOpt = poll.options.find(
                                    (o) => o.id === opt.id
                                  );
                                  if (body.value === oldOpt?.value) return;
                                  updateOptionValue({
                                    optionID: opt.id,
                                    body: body,
                                  });
                                }}
                              >
                                <IconDeviceFloppy />
                              </ActionIcon>
                              <ActionIcon
                                color="red.6"
                                onClick={() => {
                                  deleteOption(opt.id, {
                                    onSuccess: () => revalidator.revalidate(),
                                  });
                                }}
                              >
                                <IconTrash />
                              </ActionIcon>
                            </Group>
                          </Group>
                        )}
                      </Draggable>
                    ) : (
                      <Radio
                        key={opt.id}
                        value={opt.id}
                        label={opt.value}
                        size={details ? 'md' : 'sm'}
                      />
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {editMode && (
            <Group align="center" wrap="nowrap">
              <Tooltip label={addOptionOpen ? 'Close' : 'Add option'}>
                <Button
                  className={classes.addOptionBtn}
                  onClick={toggleAddOption}
                  size="compact-lg"
                >
                  {addOptionOpen ? '-' : '+'}
                </Button>
              </Tooltip>
              {addOptionOpen && (
                <>
                  <Textarea rows={1} autosize ref={addOptionRef} />
                  <ActionIcon
                    onClick={() => {
                      const body: UpdateOptionBody = {
                        value: addOptionRef.current?.value,
                      };
                      if (body.value === '') return;
                      addOption(body, {
                        onSuccess: () => {
                          revalidator.revalidate();
                          toggleAddOption();
                        },
                      });
                    }}
                  >
                    <IconDeviceFloppy />
                  </ActionIcon>
                </>
              )}
            </Group>
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
