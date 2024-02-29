import { Card, Stack, Text, Radio, RadioGroup } from '@mantine/core';
import { Poll } from '../../../services/polls';
import classes from './PollCard.module.css';

const PollCard = ({ poll }: { poll: Poll }) => {
  return (
    <Card shadow="sm" className={classes.container}>
      <Card.Section>
        <Text fw={600}>{poll.question}</Text>
      </Card.Section>
      <Card.Section className={classes.options}>
        <RadioGroup name={poll.question}>
          <Stack>
            {poll.options.map((opt) => (
              <Radio key={opt.id} value={opt.value} label={opt.value} />
            ))}
          </Stack>
        </RadioGroup>
      </Card.Section>
    </Card>
  );
};

export default PollCard;
