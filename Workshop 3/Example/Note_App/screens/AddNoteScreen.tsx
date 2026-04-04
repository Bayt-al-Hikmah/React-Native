import { useState } from "react";
import { View, Text,TextInput,TouchableOpacity} from "react-native";
import { useNotesStore } from "../store/useNotesStore";

import {styles} from "../styles/style";

export default function AddNoteScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const addNote = useNotesStore((state) => state.addNote);
  const handleAdd = () => {
    addNote(title, body);
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      
      <Text style={styles.label}>Title</Text>

      <TextInput
        placeholder="Enter note title..."
        value={title}
        onChangeText={setTitle}
        style={styles.titleInput}
      />

      <Text style={styles.label}>Body</Text>

      <TextInput
        placeholder="Write your note here..."
        value={body}
        onChangeText={setBody}
        multiline
        textAlignVertical="top"
        style={styles.bodyInput}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
        <Text style={styles.saveText}>Save Note</Text>
      </TouchableOpacity>

    </View>
  );
}