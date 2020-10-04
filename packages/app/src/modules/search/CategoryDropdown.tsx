import React from 'react';
import { Modal, ModalProps, StatusBar, TouchableOpacity } from 'react-native';
import { graphql, useFragment } from 'react-relay/hooks';

import { Column, Text } from '@booksapp/ui';

import { CategoryDropdown_query$key } from './__generated__/CategoryDropdown_query.graphql';

interface CategoryDropdownProps extends ModalProps {
  handleClose(): void;
  catogories: CategoryDropdown_query$key;
  handleSelectCategory(category?: string): void;
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

  return (
    <Modal transparent animationType="none" onRequestClose={handleClose} {...props}>
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
              handleSelectCategory(edge?.node.id);
              handleClose();
            }}
          >
            <Text color="white" size="button">
              {edge?.node.name}
            </Text>
          </TouchableOpacity>
        ))}
      </Column>
    </Modal>
  );
};

export default CategoryDropdown;
