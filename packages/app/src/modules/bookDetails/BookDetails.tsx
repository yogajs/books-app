import React, { useCallback, useRef, useState } from 'react';
import { TouchableOpacity, FlatList, Animated, Text as ReactText } from 'react-native';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay/hooks';
import { useNavigation, useRoute } from '@react-navigation/native';
import { css, useTheme } from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Button, Column, FlatListLoader, Row, Space } from '@booksapp/ui';

import { BookDetailsQuery } from './__generated__/BookDetailsQuery.graphql';
import { BookDetailsPaginationQuery } from './__generated__/BookDetailsPaginationQuery.graphql';
import { BookDetails_book$key } from './__generated__/BookDetails_book.graphql';

import Review from './Review';
import BookHeader from './BookHeader';
import OptionBottomSheet from './OptionBottomSheet';

const AnimatedText = Animated.createAnimatedComponent(ReactText);

const headerCss = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 24px 24px 12px;
  z-index: 20;
`;

const containerCss = css`
  padding: 24px 24px 0;
  background: ${(p) => p.theme.colors.background};
`;

const buttonCss = css`
  position: absolute;
  bottom: 10px;
  left: 24px;
  right: 24px;
`;

const BookDetails = () => {
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();

  const scrollY = useRef(new Animated.Value(0)).current;

  const theme = useTheme();

  const query = useLazyLoadQuery<BookDetailsQuery>(
    graphql`
      query BookDetailsQuery($id: ID!) {
        book: node(id: $id) {
          ... on Book {
            name
            ...BookHeader_header
            ...BookDetails_book
          }
        }
      }
    `,
    { id: route.params.id },
  );

  const { data, loadNext, isLoadingNext, hasNext } = usePaginationFragment<
    BookDetailsPaginationQuery,
    BookDetails_book$key
  >(
    graphql`
      fragment BookDetails_book on Book
      @argumentDefinitions(first: { type: Int, defaultValue: 10 }, after: { type: String })
      @refetchable(queryName: "BookDetailsPaginationQuery") {
        reviews(first: $first, after: $after) @connection(key: "BookDetails_reviews") {
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
              ...Review_review
            }
          }
        }
      }
    `,
    query.book,
  );

  const color = scrollY.interpolate({
    inputRange: [0, 250],
    outputRange: ['rgba(255,255,255,0)', theme.colors.background],
    extrapolate: 'clamp',
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const loadMore = useCallback(() => {
    if (isLoadingNext || !hasNext) {
      return;
    }
    loadNext(10);
  }, [isLoadingNext, loadNext, hasNext]);

  return (
    <Column flex={1} css={containerCss}>
      <Row animated style={{ backgroundColor: color }} align="center" justify="space-between" css={headerCss}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="ios-chevron-back-outline" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <AnimatedText style={{ fontSize: 18, opacity, fontWeight: 'bold' }}>{query.book.name}</AnimatedText>
        <TouchableOpacity onPress={() => setBottomSheetOpen(true)}>
          <Ionicons name="ellipsis-vertical-outline" size={24} color={theme.colors.black} />
        </TouchableOpacity>
      </Row>
      <FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        ListHeaderComponent={<BookHeader query={query.book} />}
        showsVerticalScrollIndicator={false}
        data={data.reviews.edges}
        keyExtractor={(item) => item.node.id}
        style={{ marginBottom: 14 }}
        renderItem={({ item }) => <Review query={item.node} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isLoadingNext ? (
            <>
              <FlatListLoader height={60} />
              <Space height={50} />
            </>
          ) : (
            <Space height={50} />
          )
        }
      />
      <Button buttonCss={buttonCss}>Read</Button>
      {isBottomSheetOpen && <OptionBottomSheet handleClose={() => setBottomSheetOpen(false)} />}
    </Column>
  );
};

export default BookDetails;
