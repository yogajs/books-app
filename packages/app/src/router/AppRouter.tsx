import React, { Suspense } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from 'styled-components';

import Home from '../modules/home/Home';
import HomeShimmer from '../modules/home/HomeShimmer';
import Search from '../modules/search/Search';
import SearchShimmer from '../modules/search/SearchShimmer';
import Library from '../modules/library/Library';
import LibraryShimmer from '../modules/library/LibraryShimmer';
import Profile from '../modules/profile/Profile';
import BookDetails from '../modules/bookDetails/BookDetails';
import Review from '../modules/review/Review';

const Tab = createBottomTabNavigator();

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

const LibrarySuspense = () => {
  return (
    <Suspense fallback={<LibraryShimmer />}>
      <Library />
    </Suspense>
  );
};

const AppTabs = () => {
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
      <Tab.Screen name="Library" component={LibrarySuspense} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator screenOptions={{ headerBackTitle: false }} mode="modal">
      <Stack.Screen name="App" component={AppTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Book" component={BookDetails} options={{ title: '', headerShown: false }} />
      <Stack.Screen name="Review" component={Review} options={{ title: '', headerShown: false }} />
    </Stack.Navigator>
  );
};

export default App;
