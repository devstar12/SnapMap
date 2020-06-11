import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawContent } from './DrawerContent';
import HomeScreen from './HomeScreen';
import UploadPictureScreen from './UploadPictureScreen';
import { colors } from '../../res/style/colors'
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const HomeStackScreen = ({ navigation }) => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft: () => (
              <MaterialCommunityIcons.Button name="menu" size={25}
                backgroundColor={colors.primary}
                onPress={() => navigation.openDrawer()}
              ></MaterialCommunityIcons.Button>
            ),
            headerRight: () => (
              <MaterialCommunityIcons.Button name="upload" size={25}
                backgroundColor={colors.primary}
                onPress={() => navigation.navigate('Upload Picture')}
              ></MaterialCommunityIcons.Button>
            )
          }}
        />
      </Stack.Navigator>
    );
  };
  
  const UploadPictureStackScreen = ({ navigation }) => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Upload Picture"
          component={UploadPictureScreen}
          options={{
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft: () => (
              <MaterialCommunityIcons.Button name="arrow-left" size={25}
                backgroundColor={colors.primary}
                onPress={() => navigation.goBack()}
              ></MaterialCommunityIcons.Button>
            )
          }}
        />
      </Stack.Navigator>
    );
  };
const DashboardScreen = ({ navigation }) => {
    return (
        <>
          <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={props => <DrawContent {...props} />}>
            <Drawer.Screen
              name="Home"
              component={HomeStackScreen} />
            <Drawer.Screen
              name="Upload Picture"
              component={UploadPictureStackScreen} />
          </Drawer.Navigator>
        </>
      );
}

export default DashboardScreen;