import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import pollService from '../../services/polls';
import PollCard from '../../components/PollCard';
import {
  Button,
  Grid,
  Group,
  Pagination,
  Skeleton,
  TextInput,
  Modal,
  Text,
  Stack,
  ActionIcon,
} from '@mantine/core';
import classes from './index.module.css';
import { Link } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export default function Polls() {
  const [activePage, setPage] = useState(1);
  const { isError, isLoading, error, isSuccess, data } = useQuery({
    queryKey: ['polls', activePage],
    queryFn: pollService.listPolls.bind(null, activePage),
  });

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

  return (
    <div className={`${classes.container} ${isLoading && classes.center}`}>
      <div className={classes.titleContainer}>
        <p>Create a poll and share with others.</p>
        <Button component={Link} to={'/new'} size="lg">
          Create poll
        </Button>
      </div>
      <Group justify="space-between">
        <Text>Latest:</Text>
        <Group>
          <TextInput
            placeholder="Search polls"
            ref={searchRef}
            onKeyUp={(e) => e.key === 'Enter' && search()}
          />
          <Button onClick={search}>Search</Button>
        </Group>
      </Group>
      <Grid>
        {isLoading && (
          <>
            {[...Array(12)].map((_, i) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={i}>
                <Skeleton height={300} width={350} radius="sm" m={20} />
              </Grid.Col>
            ))}
          </>
        )}
        {isError && (
          <p>
            Error:{' '}
            {error instanceof SyntaxError
              ? 'Something went wrong :('
              : error.message}
          </p>
        )}
        {isSuccess && data.polls.length === 0 && (
          <p>There are currently no polls. Be the first to create one!</p>
        )}
        {isSuccess &&
          data.polls.map((poll) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={poll.id}>
              <PollCard poll={poll} details={false} />
            </Grid.Col>
          ))}
      </Grid>
      {isSuccess && data.polls.length > 0 && (
        <Pagination
          className={classes.pagination}
          total={data.metadata.last_page}
          value={activePage}
          onChange={setPage}
        ></Pagination>
      )}
      <Modal
        opened={isSearchOpen}
        onClose={() => {
          closeSearch();
          setSearchPage(1);
          setSearchValue('');
        }}
        centered
      >
        <Stack align="center" gap="md" mb="lg">
          <Text>
            {searchData?.metadata.total_records
              ? searchData?.metadata.total_records
              : 0}{' '}
            {searchData?.metadata.total_records &&
            searchData.metadata.total_records === 1
              ? 'match'
              : 'matches'}{' '}
            for "{searchValue}"
          </Text>
          {isSearchLoading && <Text>searching...</Text>}
          {isSearchError && <Text>Error: {searchError.message}</Text>}
          {isSearchSuccess &&
            searchData.polls.map((poll) => (
              <Stack key={poll.id} className={classes.results}>
                <Link className={classes.link} to={`/${poll.id}`}>
                  <Group justify="space-between" wrap="nowrap">
                    <Text fw="bold">{poll.question}</Text>
                    <Text>&#62;</Text>
                  </Group>
                </Link>
              </Stack>
            ))}
          {isSearchSuccess &&
            searchData.metadata.total_records >
              searchData.metadata.page_size && (
              <Group>
                <ActionIcon
                  variant="outline"
                  disabled={searchData.metadata.current_page === 1}
                  onClick={() =>
                    setSearchPage(searchData.metadata.current_page - 1)
                  }
                >
                  <IconChevronLeft />
                </ActionIcon>
                <ActionIcon
                  variant="outline"
                  disabled={
                    searchData.metadata.current_page ===
                    searchData.metadata.last_page
                  }
                  onClick={() =>
                    setSearchPage(searchData.metadata.current_page + 1)
                  }
                >
                  <IconChevronRight />
                </ActionIcon>
              </Group>
            )}
        </Stack>
      </Modal>
    </div>
  );
}
