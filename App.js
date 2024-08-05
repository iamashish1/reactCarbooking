import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import CarListScreen from './CarListScreen';
import { firebase,auth,db } from './firebase/Firebase';
import SummaryScreen from './SummaryScreen';
import CarDetailScreeen from './CarDetailScreen';
import { AntDesign } from '@expo/vector-icons';
import LoadingScreen from './LoadingScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
const Tab = createBottomTabNavigator();
const TransactionsStack = createStackNavigator();
const AuthStack = createStackNavigator();



function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}


function TransactionsStackScreen() {
  return (
    <TransactionsStack.Navigator>
      <TransactionsStack.Screen
        name="Cab List"
        component={CarListScreen}
        options={{ title: 'Home' }}
      />
      <TransactionsStack.Screen
        name="Cab Detail"
        component={CarDetailScreeen}
        options={{ title: 'My Cab' }}
      />
    </TransactionsStack.Navigator>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);


    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return <LoadingScreen />; 
  }

  return (
    <NavigationContainer>
    {user ? (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={TransactionsStackScreen}
          options={{
            headerShown: false,
            tabBarIcon: (props) => <AntDesign name="bars" size={24} color={props.color} />,
          }}
        />
        <Tab.Screen
          name="My Cab"
          component={SummaryScreen}
          options={{
            headerShown: true,
            title: 'My Cab',
            tabBarIcon: (props) => <AntDesign name="info" size={24} color={props.color} />,
          }}
        />
      </Tab.Navigator>
    ) : (
      <AuthStackScreen />
    )}
  </NavigationContainer>
  );
}

export default App;
