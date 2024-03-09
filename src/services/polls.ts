import {
  PollsResponse,
  VoteResponse,
  PollResponse,
  VoteResults,
  CreatePollBody,
  EditPollBody,
} from '../types';

const fetchData = async (url: string, config: RequestInit | undefined) => {
  const response = await fetch(url, config);
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
  editPollBody: EditPollBody,
  token: string
): Promise<PollResponse> => {
  return await fetchData(`/v1/polls/${pollID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(editPollBody),
  });
};

export default {
  listPolls,
  getPoll,
  vote,
  getResults,
  createPoll,
  editPoll,
};
