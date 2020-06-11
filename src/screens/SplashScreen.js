import React, { useEffect, useState, useContext } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import Logo from "../res/assets/images/ic_logo.png";
import { AuthContext } from './auth/authContext';

const SplashScreen = props => {
  const { signIn } = useContext(AuthContext);
  useEffect(() => {
    setTimeout(() => {
      bootstrapAsync();
    }, 1500);
    const bootstrapAsync = async () => {
        auth().onAuthStateChanged((user) => {
            if (user){
                signIn({ email: user.email });
            }
            else{
                signIn({ email: null });
            }
        });
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        { justifyContent: 'center', alignItems: 'center' }
      ]}
    >
      <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={Logo} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
})
export default SplashScreen