import React from 'react';
import { FlatList } from 'react-native';
import { graphql, useFragment } from 'react-relay/hooks';

import Book from './Book';
import { LibrarySection_query$key } from './__generated__/LibrarySection_query.graphql';

interface LibrarySectionProps {
  readings: LibrarySection_query$key;
}

const LibrarySection = (props: LibrarySectionProps) => {
  const data = useFragment<LibrarySection_query$key>(
    graphql`
      fragment LibrarySection_query on Query {
        readings(first: 10) {
          edges {
            node {
              id
              book {
                id
                ...Book_book
              }
            }
          }
        }
      }
    `,
    props.readings,
  );

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      style={{ paddingVertical: 10 }}
      data={data.readings.edges}
      keyExtractor={(item) => item.node.id}
      renderItem={({ item, index }) => <Book index={index} book={item?.node.book} />}
    />
  );
};

export default LibrarySection;
