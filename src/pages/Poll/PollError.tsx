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
      <h4>{errorMessage}</h4>
    </div>
  );
}

export default PollError;
