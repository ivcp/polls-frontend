import {
  PollsResponse,
  VoteResponse,
  PollResponse,
  VoteResults,
  CreatePollBody,
  EditPollBody,
  UpdateOptionBody,
  UpdateOptionsPositionsBody,
} from '../types';

let baseUrl = '';
if (import.meta.env.PROD) {
  baseUrl = 'https://api.polls.ovh';
}

const fetchData = async (url: string, config: RequestInit | undefined) => {
  const response = await fetch(baseUrl + url, config);
  if (!response.ok) {
    if (response.status === 422) {
      const err: {
        error: {
          expires_at?: string;
          options?: string;
          question?: string;
          description?: string;
          results_visibility?: string;
        };
      } = await response.json();
      let errors = '';
      for (const entry of Object.entries(err.error)) {
        errors += `"${entry[0]}": ${entry[1]}|`;
      }
      throw new Error(errors);
    }
    const err: { error: string } = await response.json();
    throw new Error(err.error);
  }
  return await response.json();
};

const listPolls = async (page: number): Promise<PollsResponse> => {
  return await fetchData(`/v1/polls${'?page_size=12&page=' + page}`, undefined);
};

const getPoll = async (pollID: string): Promise<PollResponse> => {
  return await fetchData(`/v1/polls/${pollID}`, undefined);
};

const vote = async (
  pollID: string,
  optionID: string
): Promise<VoteResponse> => {
  return await fetchData(`/v1/polls/${pollID}/options/${optionID}`, {
    method: 'POST',
  });
};

const getResults = async (pollID: string): Promise<VoteResults> => {
  return await fetchData(`/v1/polls/${pollID}/results`, undefined);
};

const createPoll = async (poll: CreatePollBody): Promise<PollResponse> => {
  return await fetchData('/v1/polls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(poll),
  });
};

const editPoll = async (
  pollID: string,
  body: EditPollBody,
  token: string
): Promise<PollResponse> => {
  return await fetchData(`/v1/polls/${pollID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
};

const updateOptionValue = async (
  pollID: string,
  optionId: string,
  body: UpdateOptionBody,
  token: string
) => {
  return await fetchData(`/v1/polls/${pollID}/options/${optionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
};

const updateOptionsPositions = async (
  pollID: string,
  body: UpdateOptionsPositionsBody,
  token: string
) => {
  return await fetchData(`/v1/polls/${pollID}/options`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
};
const addOption = async (
  pollID: string,
  body: UpdateOptionBody,
  token: string
) => {
  return await fetchData(`/v1/polls/${pollID}/options`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
};
const deleteOption = async (
  pollID: string,
  optionId: string,
  token: string
) => {
  return await fetchData(`/v1/polls/${pollID}/options/${optionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deletePoll = async (pollID: string, token: string) => {
  return await fetchData(`/v1/polls/${pollID}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const search = async (
  pageNumber: number,
  query: string
): Promise<PollsResponse> => {
  return await fetchData(
    `/v1/polls${'?page_size=10&page=' + pageNumber + '&search=' + query}`,
    undefined
  );
};

export default {
  listPolls,
  getPoll,
  vote,
  getResults,
  createPoll,
  editPoll,
  updateOptionValue,
  updateOptionsPositions,
  addOption,
  deleteOption,
  deletePoll,
  search,
};
