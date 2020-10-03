import React from 'react';
import { TouchableOpacity } from 'react-native';
import { graphql, useFragment } from 'react-relay/hooks';
import { FlattenSimpleInterpolation } from 'styled-components';
import styled from 'styled-components/native';

import { Space, Text } from '@booksapp/ui';

import { Book_book$key } from './__generated__/Book_book.graphql';

const Container = styled.View<{ index: number; css?: FlattenSimpleInterpolation }>`
  width: 120px;
  ${(p) => p.index === 0 && `margin-left: 12px;`}
  ${(p) => p.css}
`;

const Banner = styled.Image<{ css?: FlattenSimpleInterpolation }>`
  background: ${(p) => p.theme.colors.c2};
  width: 110px;
  height: 160px;
  border-radius: 8px;
  ${(p) => p.css}
`;

interface BookProps {
  book: Book_book$key;
  index: number;
  containerCss?: FlattenSimpleInterpolation;
  bannerCss?: FlattenSimpleInterpolation;
  showName?: boolean;
}

const Book = ({ containerCss, bannerCss, showName = true, ...props }: BookProps) => {
  const data = useFragment<Book_book$key>(
    graphql`
      fragment Book_book on Book {
        id
        name
        bannerUrl
        rating
      }
    `,
    props.book,
  );

  // @TODO - add rating
  return (
    <Container css={containerCss} {...props}>
      <TouchableOpacity>
        <Banner source={{ uri: data.bannerUrl }} css={bannerCss} />

        {
          <>
            <Space height={10} />
            {showName && (
              <Text size="text" color="c3" numberOfLines={2} style={{ paddingHorizontal: 6 }}>
                {data.name}
              </Text>
            )}
          </>
        }
      </TouchableOpacity>
    </Container>
  );
};

export default Book;
