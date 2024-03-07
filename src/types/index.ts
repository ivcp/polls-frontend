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
  token?: string;
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

export interface PollsResponse {
  metadata: {
    current_page: number;
    page_size: number;
    first_page: number;
    last_page: number;
    total_records: number;
  };
  polls: Poll[];
}

export interface PollResponse {
  poll: Poll;
}

export interface VoteResponse {
  message: string;
}
export interface VoteResults {
  results: {
    id: string;
    value: string;
    position: number;
    vote_count: number;
  }[];
}
