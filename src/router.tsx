import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Layout from './Layout';
import Polls from './pages/Home';
import PollDetails from './pages/Poll';
import pollService from './services/polls';
import PollError from './pages/Poll/PollError';
('./pages/Poll');

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Polls />} />
      <Route
        path="/poll/:pollID"
        element={<PollDetails />}
        errorElement={<PollError />}
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
