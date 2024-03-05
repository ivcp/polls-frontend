export interface Poll {
  id: string;
  question: string;
  description: string;
  options: {
    id: string;
    value: string;
    position: number;
  }[];
  created_at: string;
  updated_at: string;
  expires_at: string;
  results_visibility: string;
  is_private: boolean;
}
interface PollResults {
  metadata: {
    current_page: number;
    page_size: number;
    first_page: number;
    last_page: number;
    total_records: number;
  };
  polls: Poll[];
}

export interface PollResult {
  poll: Poll;
}

interface VoteResult {
  message: string;
}
interface Results {
  results: {
    id: string;
    value: string;
    position: number;
    vote_count: number;
  }[];
}

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

export default {
  listPolls,
  getPoll,
  vote,
  getResults,
};
