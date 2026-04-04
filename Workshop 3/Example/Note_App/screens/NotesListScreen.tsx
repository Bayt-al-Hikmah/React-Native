
import { View, Text,FlatList, TouchableOpacity } from "react-native";
import { useNotesStore } from "../store/useNotesStore";
import { styles } from "../styles/style";
import { useNavigation } from '@react-navigation/native';
export default function NotesListScreen({ navigation }) {
  const notes = useNotesStore((state) => state.notes);
 

  return (
    <View style={{ flex: 1, padding: 20 }}>
		
    
     
	<FlatList  
		data={notes}  
		keyExtractor={(item) => item.id}  
		renderItem={({ item }) => (  
		<TouchableOpacity style={styles.noteCard} onPress={() => navigation.navigate("Detail", { note: item })} >
  			<Text style={styles.title}>{item.title}</Text>
  			<Text style={styles.bodyPreview} numberOfLines={2}>
    			{item.body}
  			</Text>
		</TouchableOpacity>
		)}  
		/>
    <TouchableOpacity
		style={styles.fab}
		onPress={() => navigation.navigate("AddNote")}
		>	
  		<Text style={styles.fabText}>+</Text>
	</TouchableOpacity>
	</View>
  );
}