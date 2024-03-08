import { Poll } from '../types';
import Cookies from 'js-cookie';

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

export const setCookie = (poll: Poll) => {
  if (poll.token !== undefined) {
    poll.expires_at === ''
      ? Cookies.set(poll.id, poll.token, {
          //60 days
          expires: 60,
        })
      : Cookies.set(poll.id, poll.token, {
          expires: new Date(poll.expires_at),
        });
  }
};
