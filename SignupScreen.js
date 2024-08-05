import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert,Pressable } from 'react-native';
import { firebase } from './firebase/Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase/Firebase';
import { handleException } from './firebase/FirebaseException';
import { authStyle } from './styles/AuthStyle';

import { showToastWithGravityAndOffset } from './Toast';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSignup = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                showToastWithGravityAndOffset("Successfully Signed Up")

            })
            .catch(error => {
                const errorMessage = handleException(error);
                Alert.alert('Error', errorMessage);
            });



    };

    return (
        <View
         style={authStyle.container}
         >
            <Text 
            style={authStyle.header}
            >Signup</Text>
            <TextInput
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                style={authStyle.textInput}
            />
            <TextInput
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                style={authStyle.textInput}
            />
            <Pressable title="Signup" onPress={handleSignup}
             style={authStyle.button} 
             >
            <Text style={{ color: 'white',fontWeight:'600', alignSelf: 'center' }}>SignUp</Text>
            </Pressable>
         
        </View>
    );
}