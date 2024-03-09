import { notifications } from '@mantine/notifications';
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

export const mutationError = (err: Error) => {
  if (err.message.includes('|')) {
    const messages = err.message.split('|').slice(0, -1);
    messages.forEach((message) => {
      notifications.show({
        message: message,
        color: 'red',
      });
    });
    return;
  }
  notifications.show({
    message: err.message,
    color: 'red',
  });
};

export const pollEditSuccess = (msg: string) => {
  notifications.show({
    message: msg,
  });
};
