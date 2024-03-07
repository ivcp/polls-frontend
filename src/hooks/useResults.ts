import { useQuery } from '@tanstack/react-query';
import pollService from '../services/polls';
import { useState } from 'react';

const useResults = (pollID: string) => {
  const [showResults, setShowResults] = useState(false);

  const {
    isError: isResultsError,
    error: resultsError,
    isSuccess: isResultsSuccess,
    isLoading: isResultsLoading,
    data: resultsData,
    refetch: refetchResults,
  } = useQuery({
    queryKey: ['results', pollID],
    queryFn: pollService.getResults.bind(null, pollID),
    enabled: false,
    retry: false,
  });

  return {
    showResults,
    setShowResults,
    isResultsError,
    resultsError,
    isResultsSuccess,
    isResultsLoading,
    resultsData,
    refetchResults,
  };
};

export default useResults;
