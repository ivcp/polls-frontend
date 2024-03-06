import {
  Checkbox,
  TextInput,
  Select,
  Button,
  Group,
  ActionIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { DateTimePicker } from '@mantine/dates';
import { IconTrash } from '@tabler/icons-react';

const CreatePoll = () => {
  const form = useForm({
    initialValues: {
      question: '',
      description: '',
      options: [{ value: '' }],
      expiresAt: '',
      isPrivate: false,
      resultsVisibility: 'always',
    },
    validate: {
      question: (value) =>
        value.trim() === '' ? 'Please provide a question.' : null,
      options: {
        value: (value, _, path) => {
          if (path === 'options.0.value' || path === 'options.1.value') {
            if (value.trim() === '')
              return 'Cannot be empty. At least two options needed.';
          }
          if (value.trim() === '')
            return 'Cannot be empty. Delete field if unused.';
          return null;
        },
      },
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        console.log(values);
      })}
    >
      <TextInput
        label="Question"
        withAsterisk
        {...form.getInputProps('question')}
      />
      <TextInput label="Description" {...form.getInputProps('description')} />

      {form.values.options.map((_, i) => (
        <Group key={i} align="flex-end">
          <TextInput
            label={`Option ${i + 1}`}
            withAsterisk={i > 1 ? false : true}
            {...form.getInputProps(`options.${i}.value`)}
          />
          {i > 1 && (
            <ActionIcon
              size={'1.8rem'}
              mb={'0.2rem'}
              color="red.6"
              onClick={() => form.removeListItem('options', i)}
            >
              <IconTrash />
            </ActionIcon>
          )}
        </Group>
      ))}
      <Button onClick={() => form.insertListItem('options', { value: '' })}>
        Add option
      </Button>

      <DateTimePicker
        label="Expires at"
        clearable
        {...form.getInputProps('expiresAt')}
      />

      <Checkbox
        label="Private"
        description="private polls are only accessible by link"
        {...form.getInputProps('isPrivate')}
      />
      <Select
        label="Results visibility"
        data={['always', 'after_vote', 'after_deadline']}
        defaultValue="always"
        {...form.getInputProps('resultsVisibility')}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default CreatePoll;
