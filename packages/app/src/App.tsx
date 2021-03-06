import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, Text } from 'react-native';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { ThemeProvider } from 'styled-components';

import { ErrorBoundary, theme } from '@booksapp/ui';
import { Environment } from '@booksapp/relay';

import Router from './router/Router';

const App = () => {
  return (
    <RelayEnvironmentProvider environment={Environment}>
      <StatusBar backgroundColor={theme.colors.statusBar} barStyle="dark-content" />
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <React.Suspense fallback={<Text>loading suspense</Text>}>
            <Router />
          </React.Suspense>
        </ErrorBoundary>
      </ThemeProvider>
    </RelayEnvironmentProvider>
  );
};

export default App;
