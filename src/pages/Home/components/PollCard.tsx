import {
  Card,
  Stack,
  Text,
  Radio,
  RadioGroup,
  Button,
  Group,
  Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import pollService, { Poll } from '../../../services/polls';
import classes from './PollCard.module.css';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

const PollCard = ({ poll }: { poll: Poll }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const mutation = useMutation({
    mutationFn: (optionID: string) => pollService.vote(poll.id, optionID),
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

  const expiresSet = poll.expires_at !== '';
  let voteBtnDisabled = false;
  if (expiresSet) {
    const date = new Date(poll.expires_at);
    if (date < new Date()) {
      voteBtnDisabled = true;
    }
  }

  return (
    <Card shadow="sm" className={classes.container}>
      <Card.Section>
        <Link to={`/${poll.id}`}>
          <Text fw={600}>{poll.question}</Text>
        </Link>
      </Card.Section>
      <Card.Section className={classes.options} w={'100%'}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedOption === '') return;
            mutation.mutate(selectedOption);
          }}
        >
          <Stack gap={'1.5rem'}>
            <RadioGroup
              name={poll.question}
              className={classes.radioGroup}
              value={selectedOption}
              onChange={setSelectedOption}
            >
              {poll.options.map((opt) => (
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
              <Button variant={'light'}>Results</Button>
            </Group>
          </Stack>
        </form>
      </Card.Section>
      <Link to={`/${poll.id}`}>
        <Text size="xs" className={classes.seeMore}>
          see more details
        </Text>
      </Link>
    </Card>
  );
};

export default PollCard;
