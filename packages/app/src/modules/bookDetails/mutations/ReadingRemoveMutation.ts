import { graphql } from 'react-relay';
import { RecordSourceSelectorProxy, ROOT_ID } from 'relay-runtime';

import { connectionDeleteEdgeUpdater } from '@booksapp/relay';

export const ReadingRemove = graphql`
  mutation ReadingRemoveMutation($input: ReadingRemoveInput!) {
    ReadingRemove(input: $input) {
      deletedID
      success
      error
    }
  }
`;

export const readingsRemoveMutationConnectionUpdater = (store: RecordSourceSelectorProxy) => {
  const mutationRoot = store.getRootField('ReadingRemove');
  if (!mutationRoot) {
    return;
  }

  const deletedID = mutationRoot.getValue('deletedID');

  connectionDeleteEdgeUpdater({
    parentId: ROOT_ID,
    connectionName: 'LastReadingSection_lastReading',
    nodeId: deletedID,
    store,
  });

  connectionDeleteEdgeUpdater({
    parentId: ROOT_ID,
    connectionName: 'LibrarySection_readings',
    nodeId: deletedID,
    store,
  });

  connectionDeleteEdgeUpdater({
    parentId: ROOT_ID,
    connectionName: 'ContinueReading_unfinished',
    nodeId: deletedID,
    store,
  });

  connectionDeleteEdgeUpdater({
    parentId: ROOT_ID,
    connectionName: 'ReadItAgain_finished',
    nodeId: deletedID,
    store,
  });
};
