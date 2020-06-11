import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button,Image, StyleSheet } from 'react-native';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import Logo from "../../res/assets/images/ic_logo.png"
import { AuthContext } from '../../screens/auth/authContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
const SignupScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn, signUp } = useContext(AuthContext);

    const handleSignUp = () => {
        if(email.length == 0){
            Toast.show('Please enter your email')
            return;
        }
        if(password.length < 6){
            Toast.show('Password should be 6 in length at least')
            return;
        }
        setLoading(true);
        auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          //console.log('User account created & signed in!');
          Toast.show('Registeration Successful');
          setLoading(false);
          signIn({email})
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            //console.log('That email address is already in use!');
            Toast.show('That email address is already in use!');
          }
      
          if (error.code === 'auth/invalid-email') {
            //console.log('That email address is invalid!');
            Toast.show('That email address is invalid!');
          }
          //console.error(error);
          setLoading(false);
        });
    };

    return (
        <View style={styles.container}>
            <Spinner
                visible={loading} size="large" style={styles.spinnerStyle} />
            <View style={styles.header}>
                <Image style={styles.logoContainer} source={Logo} />
                <Text
                    style={styles.welcomeTextView}
                >
                    Register your account
                </Text>
            </View>
            <View style={styles.footer}>
                <Text>
                    Email
                </Text>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder="Your Email"
                    value={email}
                    keyboardType="email-address"
                    returnKeyType="next"
                    onChangeText={setEmail}
                />
                <Text>
                    Password
                </Text>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder="Your Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    onPress={() => handleSignUp()}>
                    <View
                        style={styles.loginButtonView}>
                        <Text
                            style={styles.signInTextView}>
                            Signup
                        </Text>
                    </View>                    
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => signIn()}>
                    <View
                        style={styles.registerButtonView}>
                        <Text
                            style={styles.registerTextView}>
                            Login
                        </Text>
                    </View>                    
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2667c9',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        alignContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    welcomeTextView: {
        marginTop: 20,
        color: '#fff',
        fontSize: 20,
    },
    footer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },

    spinnerStyle: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },

    logoContainer: {
        width: 150,
        height: 150,
        alignSelf: 'center',
    },
    inputView: {
        width: "90%",
        borderRadius: 25,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20
    },
    textInputStyle: {
        height: 40,
        borderRadius: 3,
        borderWidth: 2,  // size/width of the border
        borderColor: 'lightgrey',  // color of the border
        paddingLeft: 10,
        marginTop:10,
        marginBottom:10,

    },
    loginButtonView: {
        marginTop: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,    
        borderColor: '#2667c9',
        borderWidth: 1,    
        backgroundColor: '#2667c9'
    },
    signInTextView: {
        fontSize: 16,
        color: '#fff'
    },
    registerButtonView: {
        marginTop: 20,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,    
        borderColor: '#2667c9',
        borderWidth: 1,    
        backgroundColor: '#fff'
    },
    registerTextView: {
        fontSize: 16,
        color: '#2667c9'
    },

})
export default SignupScreen;