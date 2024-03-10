import { useMutation } from '@tanstack/react-query';
import { Poll, UpdateOptionBody, UpdateOptionsPositionsBody } from '../types';
import pollService from '../services/polls';
import { mutationError, pollEditSuccess } from '../helpers';

const useUpdateOptions = (pollToken: string | undefined, poll: Poll) => {
  const { mutate: updateOptionValue } = useMutation({
    mutationFn: (v: { optionID: string; body: UpdateOptionBody }) => {
      let token = '';
      if (pollToken !== undefined) {
        token = pollToken;
      }
      return pollService.updateOptionValue(poll.id, v.optionID, v.body, token);
    },
    onError: mutationError,
    onSuccess: pollEditSuccess.bind(null, 'Saved!'),
  });

  const { mutate: updateOptionPositions } = useMutation({
    mutationFn: (body: UpdateOptionsPositionsBody) => {
      let token = '';
      if (pollToken !== undefined) {
        token = pollToken;
      }
      return pollService.updateOptionsPositions(poll.id, body, token);
    },
    onError: mutationError,
    onSuccess: pollEditSuccess.bind(null, 'Positions saved!'),
  });

  const { mutate: addOption } = useMutation({
    mutationFn: (body: UpdateOptionBody) => {
      let token = '';
      if (pollToken !== undefined) {
        token = pollToken;
      }
      return pollService.addOption(poll.id, body, token);
    },
    onError: mutationError,
    onSuccess: pollEditSuccess.bind(null, 'Option added!'),
  });
  const { mutate: deleteOption } = useMutation({
    mutationFn: (optionID: string) => {
      let token = '';
      if (pollToken !== undefined) {
        token = pollToken;
      }
      return pollService.deleteOption(poll.id, optionID, token);
    },
    onError: mutationError,
    onSuccess: pollEditSuccess.bind(null, 'Option deleted!'),
  });

  return {
    updateOptionValue,
    updateOptionPositions,
    addOption,
    deleteOption,
  };
};

export default useUpdateOptions;
