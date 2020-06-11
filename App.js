import React, { useEffect, useContext, useMemo, useReducer  } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from './src/screens/app/DashboardScreen';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import { AuthContext } from './src/screens/auth/authContext';
import { stateConditionString } from './src/utils/helpers';
import { reducer, initialState } from './src/reducer';

const Stack = createStackNavigator();

const App = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
  }, []);

  const authContextValue = useMemo(
    () => ({
      signIn: async (data) => {
        if (
          data &&
          data.email !== null 
        ) {
          console.log('Signed in')
          dispatch({ type: 'SIGN_IN' });

        } else {
          console.log('To Sign in')
          dispatch({ type: 'TO_SIGNIN_PAGE' });
        }
      },
      signOut: async (data) => {
        dispatch({ type: 'SIGN_OUT' });
      },

      signUp: async (data) => {
        if (
          data &&
          data.email !== undefined &&
          data.password !== undefined
        ) {
          dispatch({ type: 'SIGNED_UP'});
        } else {
          dispatch({ type: 'TO_SIGNUP_PAGE' });
        }
      },
    }),
    [],
  );

  const chooseScreen = (state) => {
    let navigateTo = stateConditionString(state);
    let arr = [];

    switch (navigateTo) {
      case 'LOAD_APP':
        arr.push(
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{
              headerShown: false,
            }} 
          />);
        break;

      case 'LOAD_SIGNUP':
        arr.push(
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              title: 'Signup',
              headerShown: false,
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />,
        );
        break;
      case 'LOAD_SIGNIN':
        arr.push(<Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />);
        break;

      case 'LOAD_HOME':
        arr.push(
          <Stack.Screen
            name="Home"
            component={DashboardScreen}
            options={{
              title: 'Home',
              headerShown: false,
            }}
          />,
        );
        break;
      default:
        arr.push(<Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />);
        break;
    }
    return arr[0];
  };
  return (
    <AuthContext.Provider value={authContextValue}>
      <NavigationContainer>
        <Stack.Navigator>
          {chooseScreen(state)}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;