import React, { useMemo } from 'react';
import { graphql, useFragment } from 'react-relay/hooks';
import styled from 'styled-components/native';

import { Column, Row, Space, Text } from '@booksapp/ui';

import { LastReadingSection_query$key } from './__generated__/LastReadingSection_query.graphql';

const Banner = styled.Image`
  width: 160px;
  height: 240px;
  border-radius: 8px;
`;

const CompletedTrack = styled.View`
  height: 5px;
  border-radius: 5px;
  position: relative;
  width: 100%;
  background: ${(p) => p.theme.colors.c1};
`;

const CompletedBar = styled.View<{ completed: number }>`
  height: 5px;
  border-radius: 5px;
  position: absolute;
  width: ${(p) => `${p.completed}%`};
  background: ${(p) => p.theme.colors.primary};
`;

interface LastReadingSectionProps {
  lastReading: LastReadingSection_query$key;
}

const LastReadingSection = (props: LastReadingSectionProps) => {
  const data = useFragment<LastReadingSection_query$key>(
    graphql`
      fragment LastReadingSection_query on Query {
        lastReading: readings(last: 1, filters: { finished: false }) {
          edges {
            node {
              id
              readPages
              book {
                id
                bannerUrl
                name
                author
                pages
              }
            }
          }
        }
      }
    `,
    props.lastReading,
  );

  const lastReading = useMemo(() => (data.lastReading.edges[0] ? data.lastReading.edges[0] : null), [
    data.lastReading.edges,
  ]);

  const percentageCompleted = useMemo(() => {
    if (!lastReading || !lastReading.node.book) {
      return 0;
    }

    return Number(((lastReading.node.readPages! * 100) / lastReading.node.book.pages!).toFixed(0));
  }, [lastReading]);

  return (
    <Row align="flex-end">
      <Column span={11}>
        <Banner source={{ uri: lastReading?.node.book?.bannerUrl }} />
      </Column>
      <Space width={13} />
      <Column span={8}>
        <Text size="button" weight="bold">
          {lastReading?.node.book?.name}
        </Text>
        <Space height={4} />
        <Text size="label" color="c3">
          {lastReading?.node.book?.author}
        </Text>
        <Space height={4} />
        <Row align="center">
          <CompletedTrack>
            <CompletedBar completed={percentageCompleted} />
          </CompletedTrack>
          <Space width={10} />
          <Text color="c3">{percentageCompleted}%</Text>
        </Row>
        <Space height={4} />
      </Column>
    </Row>
  );
};

export default LastReadingSection;
