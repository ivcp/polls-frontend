import { Poll } from './types';

export const checkExpired = (poll: Poll): boolean => {
  const expiresSet = poll.expires_at !== '';
  if (expiresSet) {
    const date = new Date(poll.expires_at);
    if (date < new Date()) {
      return true;
    }
  }
  return false;
};
