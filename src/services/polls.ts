import {
  PollResults,
  VoteResult,
  PollResult,
  Results,
  CreatePollBody,
} from '../types';

const listPolls = async (page: number): Promise<PollResults> => {
  const response = await fetch(`/v1/polls${'?page_size=12&page=' + page}`);
  if (!response.ok) {
    const err: { error: string } = await response.json();
    throw new Error(err.error);
  }
  return await response.json();
};

const getPoll = async (pollID: string): Promise<PollResult> => {
  const response = await fetch(`/v1/polls/${pollID}`);
  if (!response.ok) {
    const err: { error: string } = await response.json();
    throw new Error(err.error);
  }
  return await response.json();
};

const vote = async (pollID: string, optionID: string): Promise<VoteResult> => {
  const response = await fetch(`/v1/polls/${pollID}/options/${optionID}`, {
    method: 'POST',
  });
  if (!response.ok) {
    const err: { error: string } = await response.json();
    throw new Error(err.error);
  }
  return await response.json();
};

const getResults = async (pollID: string): Promise<Results> => {
  const response = await fetch(`/v1/polls/${pollID}/results`);
  if (!response.ok) {
    const err: { error: string } = await response.json();
    throw new Error(err.error);
  }
  return await response.json();
};

const createPoll = async (poll: CreatePollBody): Promise<Results> => {
  const response = await fetch('/v1/polls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(poll),
  });
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

export default {
  listPolls,
  getPoll,
  vote,
  getResults,
  createPoll,
};
