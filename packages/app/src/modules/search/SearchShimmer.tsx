import React from 'react';
import { FlatList, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { css } from 'styled-components';

import { Column, Space } from '@booksapp/ui';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const dimensions = Dimensions.get('window');

const width = (dimensions.width - 8 - 16) / 2;

const containerCss = css`
  padding: 24px 8px 0;
  background: ${(p) => p.theme.colors.background};
`;

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const SearchShimmer = () => {
  return (
    <Column flex={1} css={containerCss}>
      <Column style={{ height: 70, marginHorizontal: 8 }}>
        <ShimmerPlaceHolder width={dimensions.width - 32} height={40} style={{ borderRadius: 6 }} />
        <Space height={10} />
        <ShimmerPlaceHolder width={110} height={16} />
      </Column>
      <Space height={4} />
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        style={{ flex: 1, paddingVertical: 20 }}
        data={data}
        keyExtractor={(item, index) => String(index)}
        renderItem={() => (
          <ShimmerPlaceHolder width={width} height={width * 1.1} style={{ borderRadius: 8, margin: 4 }} />
        )}
      />
      <Space height={4} />
    </Column>
  );
};

export default SearchShimmer;
