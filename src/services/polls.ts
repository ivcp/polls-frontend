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

const listPolls = async (): Promise<PollResults> => {
  const response = await fetch(`/v1/polls${''}`);
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

export default {
  listPolls,
  getPoll,
};
