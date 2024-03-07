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

export interface CreatePollBody
  extends Omit<
    Poll,
    'id' | 'created_at' | 'updated_at' | 'options' | 'expires_at'
  > {
  options: {
    value: string;
    position: number;
  }[];
  expires_at?: string;
}

export interface PollResults {
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

export interface VoteResult {
  message: string;
}
export interface Results {
  results: {
    id: string;
    value: string;
    position: number;
    vote_count: number;
  }[];
}
