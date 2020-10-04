import React, { useCallback, useState, useTransition } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay/hooks';
import { css, useTheme } from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Column, FlatListLoader, Space, Text, TextInput } from '@booksapp/ui';
import { useDebounce } from '@booksapp/hooks';

import { SearchQuery } from './__generated__/SearchQuery.graphql';
import { SearchRefetchQuery } from './__generated__/SearchRefetchQuery.graphql';
import { Search_query$key } from './__generated__/Search_query.graphql';
import CategoryDropdown from './CategoryDropdown';
import SearchBook from './SearchBook';

const containerCss = css`
  padding: 24px 8px 0;
  background: ${(p) => p.theme.colors.background};
`;

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [startTransition, isPending] = useTransition();

  const query = useLazyLoadQuery<SearchQuery>(
    graphql`
      query SearchQuery {
        ...Search_query
        ...CategoryDropdown_query
      }
    `,
    { visible: isDropdownVisible },
  );

  // @TODO - fix weird cache and refetch while searching
  const { data, hasNext, loadNext, isLoadingNext, refetch } = usePaginationFragment<
    SearchRefetchQuery,
    Search_query$key
  >(
    graphql`
      fragment Search_query on Query
      @argumentDefinitions(
        first: { type: Int, defaultValue: 20 }
        after: { type: String }
        filters: { type: BookFilters, defaultValue: { search: "" } }
      )
      @refetchable(queryName: "SearchRefetchQuery") {
        books(first: $first, after: $after, filters: $filters) @connection(key: "Search_books") {
          endCursorOffset
          startCursorOffset
          count
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              id
              ...SearchBook_book
            }
          }
        }
      }
    `,
    query,
  );

  const refetchSearch = useCallback(
    (value: string) => {
      startTransition(() => {
        refetch({ first: 20, filters: { search: value } });
      });
    },
    [refetch],
  );

  const handleSearch = useDebounce(refetchSearch, 500, { leading: false });

  const handleSelectCategory = useCallback(
    (category?: any) => {
      setSelectedCategory(category);
      startTransition(() => {
        refetch({ first: 20, filters: { search: searchValue, ...(category ? { category: category.id } : {}) } });
      });
    },
    [refetch, searchValue],
  );

  const loadMore = useCallback(() => {
    if (isLoadingNext || !hasNext) {
      return;
    }

    loadNext(20);
  }, [hasNext, isLoadingNext, loadNext]);

  const theme = useTheme();

  return (
    <Column flex={1} css={containerCss}>
      <Column style={{ height: 70, marginHorizontal: 8 }}>
        <TextInput
          value={searchValue}
          onChangeText={(value) => {
            setSearchValue(value);
            handleSearch(value);
          }}
          placeholder="Search for movie, author, etc."
          showErrorContainer={false}
          icon={<Ionicons name="ios-search-outline" size={20} color={theme.colors.c3} />}
        />
        <TouchableOpacity onPress={() => setDropdownVisible(true)}>
          <Text size="label" color="c5">
            {selectedCategory ? `Category: ${selectedCategory.name}` : 'All Categories'}
          </Text>
        </TouchableOpacity>
      </Column>
      <Space height={4} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data.books.edges}
        keyExtractor={(item) => item.node.id}
        renderItem={({ item }) => <SearchBook book={item?.node} />}
        onEndReached={loadMore}
        ListFooterComponent={isLoadingNext ? <FlatListLoader height={60} /> : null}
        onEndReachedThreshold={0.1}
      />
      <Space height={4} />
      <CategoryDropdown
        catogories={query}
        visible={isDropdownVisible}
        handleClose={() => setDropdownVisible(false)}
        handleSelectCategory={handleSelectCategory}
      />
    </Column>
  );
};

export default Search;
