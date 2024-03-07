import pollService from '../services/polls';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

const useVote = (pollID: string) => {
  const [selectedOption, setSelectedOption] = useState('');

  const { mutate: vote } = useMutation({
    mutationFn: () => pollService.vote(pollID, selectedOption),
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

  return { vote, selectedOption, setSelectedOption };
};

export default useVote;
