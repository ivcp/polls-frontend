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
import { Poll } from '../../../services/polls';
import classes from './PollCard.module.css';
import { useForm } from '@mantine/form';

const PollCard = ({ poll }: { poll: Poll }) => {
  const form = useForm({
    initialValues: {
      selectedOption: '',
    },
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
        <Text fw={600}>{poll.question}</Text>
      </Card.Section>
      <Card.Section className={classes.options} w={'100%'}>
        <form onSubmit={form.onSubmit((value) => console.log(value))}>
          <Stack gap={'1.5rem'}>
            <RadioGroup name={poll.question} className={classes.radioGroup}>
              {poll.options.map((opt) => (
                <Radio
                  key={opt.id}
                  value={opt.value}
                  label={opt.value}
                  {...form.getInputProps('selectedOption', {
                    type: 'checkbox',
                  })}
                />
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
    </Card>
  );
};

export default PollCard;
