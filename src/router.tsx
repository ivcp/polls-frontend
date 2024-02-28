import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Layout from './Layout';
import Polls from './Polls';
import PollDetails from './PollDetails';
import pollService from './services/polls';
import ErrorPoll from './Error';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="polls" element={<Polls />} />
      <Route
        path="/poll/:pollID"
        element={<PollDetails />}
        errorElement={<ErrorPoll />}
        loader={async ({ params }) => {
          if (params.pollID !== undefined) {
            return await pollService.getPoll(params.pollID);
          }
        }}
      />
    </Route>
  )
);

export default router;
