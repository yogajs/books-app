import React from 'react';
import { graphql, useFragment } from 'react-relay/hooks';
import styled from 'styled-components/native';

import { Column, Row, Space, Text } from '@booksapp/ui';

import Rating from '../rating/Rating';

import { BookHeader_header$key } from './__generated__/BookHeader_header.graphql';

const Banner = styled.Image`
  background: ${(p) => p.theme.colors.c2};
  width: 200px;
  height: 280px;
  border-radius: 8px;
`;

const Separator = styled.View`
  background: ${(p) => p.theme.colors.c2};
  width: 1px;
  height: 70%;
  border-radius: 8px;
  margin: 0 20px;
`;

interface BookHeaderProps {
  query: BookHeader_header$key;
}

const BookHeader = (props: BookHeaderProps) => {
  const data = useFragment<BookHeader_header$key>(
    graphql`
      fragment BookHeader_header on Book {
        id
        bannerUrl
        name
        author
        rating
        pages
        releaseYear
        description
      }
    `,
    props.query,
  );

  return (
    <>
      <Column align="center" justify="center">
        <Banner source={{ uri: data.bannerUrl }} />
        <Space height={15} />
        <Rating initialRating={data.rating} disabled />
        <Space height={10} />
        <Text size="title" weight="bold" center>
          {data.name}
        </Text>
        <Space height={10} />
        <Text size="button" color="c3" center>
          {data.author}
        </Text>
        <Space height={30} />
        <Row align="center" justify="center">
          <Column align="center" justify="center">
            <Text size="button" weight="bold">
              {data.releaseYear}
            </Text>
            <Space height={4} />
            <Text color="c3">Year of Release</Text>
          </Column>
          <Separator />
          <Column align="center" justify="center">
            <Text size="button" weight="bold">
              {data.pages}
            </Text>
            <Space height={4} />
            <Text color="c3">Amount of Pages</Text>
          </Column>
        </Row>
        <Space height={40} />
      </Column>

      <Text size="button" weight="bold">
        About
      </Text>
      <Space height={10} />
      <Text size="label" color="c3">
        {data.description}
      </Text>
      <Space height={30} />
      <Text size="button" weight="bold">
        Reviews
      </Text>
    </>
  );
};

export default BookHeader;
