import React from 'react';
import { FlatList } from 'react-native';
import { graphql, useFragment } from 'react-relay/hooks';

import { css, useTheme } from 'styled-components/native';

import { Column, Text } from '@booksapp/ui';

import Book from './Book';
import { TrendingSection_query$key } from './__generated__/TrendingSection_query.graphql';

const bookCss = css`
  width: 190px;
`;

const bookBannerCss = css`
  width: 180px;
  height: 250px;
`;

const positionTextCss = css`
  position: absolute;
  left: 8px;
  bottom: 2px;
`;

interface TrendingSectionProps {
  trending: TrendingSection_query$key;
}

const TrendingSection = (props: TrendingSectionProps) => {
  //@TODO - add trending filter = most readings last 7 days
  const data = useFragment<TrendingSection_query$key>(
    graphql`
      fragment TrendingSection_query on Query {
        books(first: 10) {
          edges {
            node {
              id
              ...Book_book
            }
          }
        }
      }
    `,
    props.trending,
  );

  const theme = useTheme();

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      style={{ paddingVertical: 10 }}
      data={data.books.edges}
      keyExtractor={(item) => item?.node.id}
      renderItem={({ item, index }) => (
        <Column style={{ position: 'relative' }}>
          <Book index={index} book={item?.node} showName={false} containerCss={bookCss} bannerCss={bookBannerCss} />
          <Text
            size="extraLarge"
            color="white"
            css={positionTextCss}
            style={{
              marginLeft: index === 0 ? 12 : 0,
              textShadowColor: theme.colors.black,
              textShadowOffset: { width: 5, height: 5 },
              textShadowRadius: 10,
            }}
          >
            {index + 1}
          </Text>
        </Column>
      )}
    />
  );
};

export default TrendingSection;
