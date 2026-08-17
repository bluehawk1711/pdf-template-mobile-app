import 'react-native-gesture-handler';
import 'react-native-screens';

import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

import { RootStackParamList } from './src/types';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import TemplateSelectionScreen from './src/screens/TemplateSelectionScreen';
import PageViewerScreen from './src/screens/PageViewerScreen';
import InvoiceFormScreen from './src/screens/InvoiceFormScreen';
import PreviewScreen from './src/screens/PreviewScreen';
import HistoryScreen from './src/screens/HistoryScreen';

import { InvoiceProvider } from './src/context/InvoiceContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

function DrawerScreens() {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: colors.background,
        },
        drawerLabelStyle: {
          marginLeft: 10,
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="History" component={HistoryScreen} />
    </Drawer.Navigator>
  );
}

function RootNavigator() {
  const { theme, colors } = useTheme();

  const paperTheme =
    theme === 'dark'
      ? {
        ...MD3DarkTheme,
        colors: {
          ...MD3DarkTheme.colors,
          background: colors.background,
          surface: colors.card,
          onSurface: colors.text,
          primary: colors.primary,
          outline: colors.border,
        },
      }
      : {
        ...MD3LightTheme,
        colors: {
          ...MD3LightTheme.colors,
          background: colors.background,
          surface: colors.card,
          onSurface: colors.text,
          primary: colors.primary,
          outline: colors.border,
        },
      };

  const navigationTheme =
    theme === 'dark'
      ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          primary: colors.primary,
        },
      }
      : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          primary: colors.primary,
        },
      };

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={DrawerScreens} />
          <Stack.Screen name="TemplateSelection" component={TemplateSelectionScreen} />
          <Stack.Screen name="PageViewer" component={PageViewerScreen} />
          <Stack.Screen name="InvoiceForm" component={InvoiceFormScreen} />
          <Stack.Screen name="Preview" component={PreviewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <RootNavigator />
      </InvoiceProvider>
    </ThemeProvider>
  );
}