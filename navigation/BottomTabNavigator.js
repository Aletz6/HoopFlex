import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../screens/HomePage";
import Profile from "../screens/Profile";
import Exercises from "../screens/Exercises";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#121212" },
        tabBarActiveTintColor: "#e04dff",
        tabBarInactiveTintColor: "#fff",
      }}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Exercises" component={Exercises} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
