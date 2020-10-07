import React, { useRef } from 'react';
import { PanResponder, StatusBar, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import styled, { css } from 'styled-components/native';

import Column from './Column';

const { height, width } = Dimensions.get('screen');

const Container = styled.TouchableOpacity`
  background: #fff;
  z-index: 40;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  bottom: 50px;
`;

const panelHandleCss = css`
  width: 40px;
  height: 4px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  margin-bottom: 10px;
`;

const containerCss = css`
  background: #fff;
`;

export interface BottomSheetProps {
  handleClose(): void;
  children?: React.ReactNode;
}

const BottomSheet = ({ handleClose, children }: BottomSheetProps) => {
  const yAxis = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: yAxis }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        if (yAxis._value >= 60) {
          Animated.timing(yAxis, {
            toValue: height,
            duration: 100,
            useNativeDriver: true,
          }).start(() => {
            handleClose();
          });
        } else {
          Animated.spring(yAxis, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(yAxis, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={handleClose}>
      <StatusBar backgroundColor="rgba(0,0,0,0.6)" barStyle="light-content" />
      <TouchableOpacity
        activeOpacity={1}
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', height, width }}
        onPress={handleClose}
      >
        <Animated.View
          style={{
            height,
            width,
            justifyContent: 'flex-end',
            transform: [{ translateY: yAxis }],
          }}
          {...panResponder.panHandlers}
        >
          <Container activeOpacity={1}>
            <Column align="center" justify="center">
              <Column css={panelHandleCss} />
            </Column>

            <Column css={containerCss}>{children}</Column>
          </Container>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default BottomSheet;
