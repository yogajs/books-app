import React from 'react';
import { Modal, ModalProps, StatusBar, TouchableOpacity } from 'react-native';
import { graphql, useFragment } from 'react-relay/hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled, { useTheme } from 'styled-components/native';

import { Column, Text } from '@booksapp/ui';

import { CategoryDropdown_query$key } from './__generated__/CategoryDropdown_query.graphql';

const CloseButton = styled.TouchableOpacity`
  background: #fff;
  height: 40px;
  width: 40px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 10px;
  top: 10px;
`;

interface CategoryDropdownProps extends ModalProps {
  handleClose(): void;
  catogories: CategoryDropdown_query$key;
  handleSelectCategory(category?: any): void;
}

const CategoryDropdown = ({ handleClose, handleSelectCategory, catogories, ...props }: CategoryDropdownProps) => {
  // @TODO - fix problem with skip when model is closed
  const data = useFragment<CategoryDropdown_query$key>(
    graphql`
      fragment CategoryDropdown_query on Query {
        categories {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
    catogories,
  );

  const theme = useTheme();

  return (
    <Modal transparent animationType="slide" onRequestClose={handleClose} {...props}>
      <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
      <Column align="center" justify="center" flex={1} style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => {
            handleSelectCategory();
            handleClose();
          }}
        >
          <Text color="white" size="button">
            All Categories
          </Text>
        </TouchableOpacity>
        {data.categories?.edges.map((edge) => (
          <TouchableOpacity
            key={edge?.node.id}
            style={{ padding: 10 }}
            onPress={() => {
              handleSelectCategory(edge?.node);
              handleClose();
            }}
          >
            <Text color="white" size="button">
              {edge?.node.name}
            </Text>
          </TouchableOpacity>
        ))}
      </Column>
      <CloseButton onPress={handleClose}>
        <Ionicons name="ios-arrow-back" size={20} color={theme.colors.c5} />
      </CloseButton>
    </Modal>
  );
};

export default CategoryDropdown;
