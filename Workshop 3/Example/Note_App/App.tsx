import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NotesListScreen from "./screens/NotesListScreen";
import AddNoteScreen from "./screens/AddNoteScreen";
import NoteDetailScreen from "./screens/NoteDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Notes" component={NotesListScreen} />
        <Stack.Screen name="AddNote" component={AddNoteScreen} />
        
  
        <Stack.Screen name="Detail" component={NoteDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}