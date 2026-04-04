import React from "react";
import { View, Text, Button } from "react-native";
import { useNotesStore } from "../store/useNotesStore";
import {styles} from "../styles/style";

export default function NoteDetailScreen({ route, navigation }) {
  const { note } = route.params;
  const deleteNote = useNotesStore((state) => state.deleteNote);

  const handleDelete = () => {
    deleteNote(note.id);
    navigation.goBack();
  };

  return (
    <View style={styles.note}>
      <View style={styles.content}>
        <Text style={styles.notetitle}>{note.title}</Text>
        <Text style={styles.body}>{note.body}</Text>
      </View>

      <View style={styles.deleteContainer}>
        <Button title="Delete Note" color="#e53935" onPress={handleDelete} />
      </View>
    </View>
  );
}