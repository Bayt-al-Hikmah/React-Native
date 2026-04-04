import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import { styles } from "./styles/style";
import Realm from "realm"; 
import {Task} from "./Schemas/Schema";

 
  
const realm = new Realm({  
  schema: [Task.schema],
  schemaVersion: 1,      
});

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<{"text":string,"_id":Realm.BSON.ObjectId}[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  useEffect(() => {
    const allTasks = realm.objects<Task>("Task");
    setTasks(allTasks.map((t) => ({"text":t.text,"_id":t._id})));

  }, []);


  const addTask = () => {
    if (!task.trim()) return;

    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      const task_id = updatedTasks[editingIndex]._id;
      updatedTasks[editingIndex] = {"_id":task_id, "text": task};
      setTasks(updatedTasks);
      realm.write(() => {  
  const ts = realm.objectForPrimaryKey("Task",task_id);
  if (ts) {  
    ts.text = task;  
  }  
});
      setEditingIndex(null);
    } else {
      const task_id = new Realm.BSON.ObjectId();
      realm.write(() => {  
      realm.create("Task", {  
      _id: task_id, 
      text: task,  
     });  
    });
      setTasks([...tasks, {"text":task,"_id":task_id}]);
    }

    setTask("");
  };

  const deleteTask = (id:Realm.BSON.ObjectId) => {
    realm.write(() => {  
  const task = realm.objectForPrimaryKey("Task",id);
  
  if (task) {  
    realm.delete(task);  
  }  
});
    const updatedTasks = tasks.filter((task, i) => task._id !== id);
    setTasks(updatedTasks);
  };

  const editTask = (index: number) => {
    setTask(tasks[index].text);
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>

      <TextInput
        placeholder="Enter a task"
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />

      <Pressable style={styles.addButton} onPress={addTask}>
        <Text style={styles.buttonText}>
          {editingIndex !== null ? "Update Task" : "Add Task"}
        </Text>
      </Pressable>

      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.text}</Text>

            <View style={styles.actions}>
              <Pressable
                style={styles.editButton}
                onPress={() => editTask(index)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteTask(item._id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}