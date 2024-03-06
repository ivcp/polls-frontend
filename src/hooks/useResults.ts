import { useQuery } from '@tanstack/react-query';
import pollService from '../services/polls';

const useResults = (pollID: string) => {
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
    isResultsError,
    resultsError,
    isResultsSuccess,
    isResultsLoading,
    resultsData,
    refetchResults,
  };
};

export default useResults;
