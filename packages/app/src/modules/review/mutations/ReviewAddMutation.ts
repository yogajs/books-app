import { graphql } from 'react-relay';

export const ReviewAdd = graphql`
  mutation ReviewAddMutation($input: ReviewAddInput!) {
    ReviewAdd(input: $input) {
      reviewEdge {
        cursor
        node {
          id
          description
          rating
          book {
            id
          }
        }
      }
      error
    }
  }
`;
