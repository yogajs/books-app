import React from 'react';
import { graphql, useFragment } from 'react-relay/hooks';
import { css } from 'styled-components';

import { Column, Row, Space, Text } from '@booksapp/ui';

import Rating from '../rating/Rating';

import { Review_review$key } from './__generated__/Review_review.graphql';

const containerCss = css`
  margin: 10px 0;
`;

interface ReviewProps {
  query: Review_review$key;
}

const Review = (props: ReviewProps) => {
  const data = useFragment<Review_review$key>(
    graphql`
      fragment Review_review on Review {
        id
        rating
        description
        user {
          id
          fullName
        }
      }
    `,
    props.query,
  );

  return (
    <Column css={containerCss}>
      <Row align="center">
        <Text size="label" color="c5">
          {data.user.fullName}
        </Text>
        <Space width={20} />
        <Rating initialRating={data.rating} size={14} disabled />
      </Row>
      <Space height={8} />
      <Text color="c3" italic={!data.description}>
        {data.description || 'No description'}
      </Text>
    </Column>
  );
};

export default Review;
