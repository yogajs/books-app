import React, { Suspense } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from 'styled-components';

import { Column, Text } from '@booksapp/ui';

import Home from '../modules/home/Home';
import HomeShimmer from '../modules/home/HomeShimmer';
import Profile from '../modules/profile/Profile';
import Search from '../modules/search/Search';
import SearchShimmer from '../modules/search/SearchShimmer';

const Tab = createBottomTabNavigator();

const GenericTab = ({ name }) => {
  return (
    <Column flex={1} align="center" justify="center">
      <Text>{name}</Text>
    </Column>
  );
};

// @TODO - add shimmer loader

const HomeSuspense = () => {
  return (
    <Suspense fallback={<HomeShimmer />}>
      <Home />
    </Suspense>
  );
};

const SearchSuspense = () => {
  return (
    <Suspense fallback={<SearchShimmer />}>
      <Search />
    </Suspense>
  );
};

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
        keyboardHidesTabBar: true,
      }}
    >
      <Tab.Screen name="Home" component={HomeSuspense} />
      <Tab.Screen name="Search" component={SearchSuspense} />
      <Tab.Screen name="Library" component={Library} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default App;
