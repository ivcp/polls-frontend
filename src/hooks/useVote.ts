import pollService from '../services/polls';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

const useVote = (pollID: string) => {
  const { mutate: vote } = useMutation({
    mutationFn: (optionID: string) => pollService.vote(pollID, optionID),
    onError: (err) =>
      notifications.show({
        message: err.message.charAt(0).toUpperCase() + err.message.slice(1),
        color: 'red',
      }),
    onSuccess: (data) =>
      notifications.show({
        message: data.message.charAt(0).toUpperCase() + data.message.slice(1),
      }),
  });

  return vote;
};

export default useVote;
