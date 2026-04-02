import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10
  },

  addButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    alignItems: "center"
  },

  buttonText: {
    color: "white",
    fontWeight: "bold"
  },

  taskItem: {
    flexDirection: "row",
    justifyContent:"space-between",
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10
  },

  taskText: {
    fontSize: 16,
    marginBottom: 8
  },

  actions: {
    flexDirection: "row",
    gap: 10
  },

  editButton: {
    backgroundColor: "orange",
    padding: 8,
    borderRadius: 5
  },

  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5
  }
});