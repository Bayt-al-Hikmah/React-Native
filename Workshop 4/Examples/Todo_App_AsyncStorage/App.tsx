import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import { styles } from "./styles/style";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };
    loadTasks();
  }, []);

 

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks:", error);
      }
    };
    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) return;

    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = task;
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, task]);
    }

    setTask("");
  };

  const deleteTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const editTask = (index: number) => {
    setTask(tasks[index]);
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
            <Text style={styles.taskText}>{item}</Text>

            <View style={styles.actions}>
              <Pressable
                style={styles.editButton}
                onPress={() => editTask(index)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteTask(index)}
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