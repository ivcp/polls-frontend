import { Title } from '@mantine/core';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

function PollError() {
  const err = useRouteError();
  let errorMessage: string;

  if (isRouteErrorResponse(err)) {
    errorMessage = err.statusText;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  } else if (typeof err === 'string') {
    errorMessage = err;
  } else {
    console.error(err);
    errorMessage = 'Unknown error.';
  }

  return (
    <div>
      <Title order={4} mt={'2rem'} ta={'center'}>
        Error loading poll: {errorMessage}
      </Title>
    </div>
  );
}

export default PollError;
