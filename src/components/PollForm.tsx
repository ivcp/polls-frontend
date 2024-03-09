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
  InputLabel,
  ActionIcon,
} from '@mantine/core';
import classes from './PollForm.module.css';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useListState } from '@mantine/hooks';
import useUpdateOptions from '../hooks/useUpdateOptions';

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
  const options = [...poll.options].sort((a, b) => a.position - b.position);

  const [optionsList, handlers] = useListState(options);

  const { mutateOptionValue, mutateOptionPositions } = useUpdateOptions(
    pollToken,
    poll
  );

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
          <DragDropContext
            onDragEnd={({ source, destination }) => {
              if (
                destination?.index !== undefined &&
                destination?.index !== source.index
              ) {
                const dragged = optionsList.find(
                  (o) => o.position === source.index
                );
                const draggedOver = optionsList.find(
                  (o) => o.position === destination.index
                );

                if (dragged === undefined || draggedOver === undefined) return;

                const body: UpdateOptionsPositionsBody = {
                  options: [
                    { id: dragged.id, position: destination.index },
                    { id: draggedOver.id, position: source.index },
                  ],
                };
                mutateOptionPositions(body);
                handlers.reorder({ from: source.index, to: destination.index });
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
                          >
                            <InputLabel>{opt.position + 1}</InputLabel>
                            <Textarea
                              rows={1}
                              autosize
                              value={opt.value}
                              onChange={(e) => {
                                handlers.setItemProp(
                                  opt.position,
                                  'value',
                                  e.target.value
                                );
                              }}
                            />
                            <ActionIcon
                              onClick={() => {
                                const body: UpdateOptionBody = {
                                  value: opt.value,
                                };
                                const oldOpt = poll.options.find(
                                  (o) => o.id === opt.id
                                );
                                if (body.value === oldOpt?.value) return;
                                mutateOptionValue({
                                  optionID: opt.id,
                                  body: body,
                                });
                              }}
                            >
                              <IconDeviceFloppy />
                            </ActionIcon>
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
