import React, { Suspense } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from 'styled-components';

import { Column, Text } from '@booksapp/ui';

import Home from '../modules/home/Home';
import Profile from '../modules/profile/Profile';

const Tab = createBottomTabNavigator();

const GenericTab = ({ name }) => {
  return (
    <Column flex={1} align="center" justify="center">
      <Text>{name}</Text>
    </Column>
  );
};

const HomeSuspense = () => {
  return (
    <Suspense fallback={<Text>loading home</Text>}>
      <Home />
    </Suspense>
  );
};

const Search = () => <GenericTab name="Search" />;
const Library = () => <GenericTab name="Library" />;

const App = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'ios-home-outline';
          } else if (route.name === 'Search') {
            iconName = 'ios-search-outline';
          } else if (route.name === 'Library') {
            iconName = 'ios-book-outline';
          } else if (route.name === 'Profile') {
            iconName = 'ios-person-outline';
          }

          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: theme.colors.primary,
        inactiveTintColor: theme.colors.c3,
        showLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeSuspense} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Library" component={Library} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default App;
