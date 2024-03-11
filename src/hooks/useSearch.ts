import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import pollService from '../services/polls';

const useSearch = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [isSearchOpen, { open: openSearch, close: closeSearch }] =
    useDisclosure(false);

  const {
    isSuccess: isSearchSuccess,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
    data: searchData,
  } = useQuery({
    queryKey: ['search', searchValue, searchPage],
    queryFn: pollService.search.bind(null, searchPage, searchValue),
    enabled: !!searchValue,
  });

  const search = () => {
    if (
      searchRef.current?.value &&
      searchRef.current.value.trim() !== '' &&
      !searchRef.current.value.startsWith('&')
    ) {
      openSearch();
      setSearchValue(searchRef.current.value);
    }
  };

  return {
    searchRef,
    searchValue,
    setSearchValue,
    setSearchPage,
    isSearchOpen,
    closeSearch,
    isSearchSuccess,
    isSearchLoading,
    isSearchError,
    searchError,
    searchData,
    search,
  };
};

export default useSearch;
