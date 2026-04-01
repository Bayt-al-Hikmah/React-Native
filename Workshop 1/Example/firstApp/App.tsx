import { View, Text, Button } from "react-native";  
import { useState } from "react";  
import styles from "./styles/AppStyles"; 
  
export default function App() {  
const [count, setCount] = useState<number>(0);  
  
return (  
<View style={styles.container}>  
<Text style={styles.title}>Counter App</Text>  
<Text style={styles.subtitle}>{count}</Text>  
<View style={styles.buttonContainer}>  
<Button title="Increment" onPress={() => setCount(count + 1)} />  
<View style={{ width: 16 }} /> 
<Button title="Decrement" onPress={() => setCount(count - 1)} />  
</View>  
</View>  
);  
}