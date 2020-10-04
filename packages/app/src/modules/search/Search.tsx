import React, { useCallback, useState, useTransition } from 'react';
import { Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { graphql, useLazyLoadQuery, useRefetchableFragment } from 'react-relay/hooks';
import styled, { css, useTheme } from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Column, Space, Text, TextInput } from '@booksapp/ui';
import { useDebounce } from '@booksapp/hooks';

import { SearchQuery } from './__generated__/SearchQuery.graphql';
import { SearchRefetchQuery } from './__generated__/SearchRefetchQuery.graphql';
import { Search_query$key } from './__generated__/Search_query.graphql';
import CategoryDropdown from './CategoryDropdown';

const containerCss = css`
  padding: 24px 8px 0;
  background: ${(p) => p.theme.colors.background};
`;

const dimensions = Dimensions.get('window');

const width = (dimensions.width - 8 - 16) / 2;

const Banner = styled.Image<{ index: number }>`
  width: ${`${width}px`};
  height: ${`${width * 1.1}px`};
  border-radius: 8px;
  margin: 4px;
`;

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [startTransition, isPending] = useTransition();

  const data = useLazyLoadQuery<SearchQuery>(
    graphql`
      query SearchQuery {
        categories {
          edges {
            node {
              id
              name
            }
          }
        }
        ...Search_query
        ...CategoryDropdown_query
      }
    `,
    { visible: isDropdownVisible },
  );

  // @TODO - fix weird cache
  const [search, refetch] = useRefetchableFragment<SearchRefetchQuery, Search_query$key>(
    graphql`
      fragment Search_query on Query
      @argumentDefinitions(
        first: { type: Int, defaultValue: 20 }
        after: { type: String }
        filters: { type: BookFilters, defaultValue: { search: "" } }
      )
      @refetchable(queryName: "SearchRefetchQuery") {
        id
        books(first: $first, after: $after, filters: $filters) @connection(key: "Search_books", filters: []) {
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
              bannerUrl
            }
          }
        }
      }
    `,
    data,
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
    (category?: string) => {
      const selected = data.categories.edges.find((edge) => edge.node.id === category);

      setSelectedCategory(selected);
      startTransition(() => {
        refetch({ first: 20, filters: { search: searchValue, ...(category ? { category } : {}) } });
      });
    },
    [data.categories.edges, refetch, searchValue],
  );

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
            {selectedCategory ? `Category: ${selectedCategory.node.name}` : 'All Categories'}
          </Text>
        </TouchableOpacity>
      </Column>
      <Space height={4} />
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        style={{ flex: 1, paddingVertical: 20 }}
        data={search.books.edges}
        keyExtractor={(item) => item.node.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity>
            <Banner source={{ uri: item?.node.bannerUrl }} index={index} />
          </TouchableOpacity>
        )}
      />
      <Space height={4} />

      <CategoryDropdown
        catogories={data}
        visible={isDropdownVisible}
        handleClose={() => setDropdownVisible(false)}
        handleSelectCategory={handleSelectCategory}
      />
    </Column>
  );
};

export default Search;
