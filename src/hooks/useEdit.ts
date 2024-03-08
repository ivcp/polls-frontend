import { useRef } from 'react';

const useEdit = () => {
  const questionRef = useRef<HTMLInputElement>(null);

  return {
    questionRef,
  };
};

export default useEdit;
