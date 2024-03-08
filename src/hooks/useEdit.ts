import { useRef } from 'react';

const useEdit = () => {
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const expiresRef = useRef<HTMLButtonElement>(null);

  return {
    questionRef,
    descriptionRef,
    expiresRef,
  };
};

export default useEdit;
