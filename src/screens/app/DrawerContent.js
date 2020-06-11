import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Drawer,
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from '../../res/assets/images/ic_logo.png';
import { AuthContext } from '../../screens/auth/authContext';
import auth from '@react-native-firebase/auth';
export function DrawContent(props) {
    const [email, setEmail] = useState('')
    const { signOut } = useContext(AuthContext);

    useEffect(() => {
        const bootstrapAsync = async () => {
            auth().onAuthStateChanged((user) => {
                if (user){
                    setEmail(user.email);
                }
                else{
                    setEmail('Guest')
                }
            });
        };
        bootstrapAsync();

    }, []);
    const handleSignout = () => {
        if(email !== 'Guest'){
            auth()
            .signOut()
            .then(() => signOut());    
        }
        else{
            signOut();
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Avatar.Image
                                source={Logo}
                                size={50} />
                            <View style={{ marginLeft: 15, alignItems: 'center', justifyContent: 'center' }}>
                                <Caption style={styles.caption}>{email}</Caption>
                            </View>

                        </View>
                    </View>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <MaterialCommunityIcons
                                    name="home-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Home"
                            onPress={() => { props.navigation.navigate('Home') }}>
                        </DrawerItem>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <MaterialCommunityIcons
                                    name="upload"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Upload Picture"
                            onPress={() => { props.navigation.navigate('Upload Picture') }}>
                        </DrawerItem>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <MaterialCommunityIcons
                            name="exit-to-app"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Sign out"
                    onPress={() => handleSignout()}>

                </DrawerItem>

            </Drawer.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});