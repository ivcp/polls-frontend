import { useMutation } from '@tanstack/react-query';
import { Poll, UpdateOptionBody, UpdateOptionsPositionsBody } from '../types';
import pollService from '../services/polls';
import { mutationError, pollEditSuccess } from '../helpers';

const useUpdateOptions = (pollToken: string | undefined, poll: Poll) => {
  const { mutate: mutateOptionValue } = useMutation({
    mutationFn: (v: { optionID: string; body: UpdateOptionBody }) => {
      let token = '';
      if (pollToken !== undefined) {
        token = pollToken;
      }
      return pollService.updateOptionValue(poll.id, v.optionID, v.body, token);
    },
    onError: mutationError,
    onSuccess: pollEditSuccess,
  });

  const { mutate: mutateOptionPositions } = useMutation({
    mutationFn: (body: UpdateOptionsPositionsBody) => {
      let token = '';
      if (pollToken !== undefined) {
        token = pollToken;
      }
      return pollService.updateOptionsPositions(poll.id, body, token);
    },
    onError: mutationError,
    onSuccess: pollEditSuccess,
  });

  return {
    mutateOptionValue,
    mutateOptionPositions,
  };
};

export default useUpdateOptions;
