import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { graphql, usePaginationFragment } from 'react-relay/hooks';

import { FlatListLoader } from '@booksapp/ui';

import Book from './Book';
import { ForYouSectionPaginationQuery } from './__generated__/ForYouSectionPaginationQuery.graphql';
import { ForYouSection_query$key } from './__generated__/ForYouSection_query.graphql';

interface ForYouSectionProps {
  recommendedBooks: ForYouSection_query$key;
}

const ForYouSection = (props: ForYouSectionProps) => {
  // @TODO - add recommendedBooks resolver
  const { data, loadNext, isLoadingNext, hasNext } = usePaginationFragment<
    ForYouSectionPaginationQuery,
    ForYouSection_query$key
  >(
    graphql`
      fragment ForYouSection_query on Query
      @argumentDefinitions(first: { type: Int, defaultValue: 10 }, after: { type: String })
      @refetchable(queryName: "ForYouSectionPaginationQuery") {
        recommendedBooks: books(first: $first, after: $after)
          @connection(key: "ForYouSection_recommendedBooks", filters: []) {
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
            node {
              id
              ...Book_book
            }
          }
        }
      }
    `,
    props.recommendedBooks,
  );

  const loadMore = useCallback(() => {
    if (isLoadingNext || !hasNext) {
      return;
    }
    loadNext(10);
  }, [isLoadingNext, loadNext, hasNext]);

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      style={{ paddingVertical: 10 }}
      data={data.recommendedBooks.edges}
      keyExtractor={(item) => item?.node.id}
      renderItem={({ item, index }) => <Book index={index} book={item?.node} />}
      onEndReached={loadMore}
      ListFooterComponent={isLoadingNext ? <FlatListLoader /> : null}
    />
  );
};

export default ForYouSection;
