import React, { useCallback, useRef, useState } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components';

import star from '../../assets/star.png';

interface IStar {
  position: number;
  handleRatingChange(rating: number): void;
  fill: boolean;
  size?: number;
  disabled?: boolean;
}

const Star = ({ position, handleRatingChange, fill, size = 20, disabled }: IStar) => {
  const [selected, setSelected] = useState(false);

  const springValue = useRef(new Animated.Value(1)).current;

  const handleRated = useCallback(() => {
    springValue.setValue(1.2);

    Animated.spring(springValue, {
      toValue: 1,
      friction: 2,
      tension: 1,
      useNativeDriver: true,
    }).start();

    setSelected(!selected);

    handleRatingChange(position);
  }, [handleRatingChange, position, selected, springValue]);

  const theme = useTheme();

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleRated} disabled={disabled}>
      <Animated.Image
        source={star}
        style={{
          margin: 3,
          tintColor: fill ? theme.colors.primary : theme.colors.c1,
          width: size,
          height: size,
          transform: [{ scale: springValue }],
        }}
      />
    </TouchableOpacity>
  );
};

export default Star;
