import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f4f7",
  },

  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#444",
    fontWeight: "600",
  },

  titleInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 20,
  },

  bodyInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    height: 180,
    lineHeight: 22,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  saveButton: {
    marginTop: 30,
    backgroundColor: "#4a6cf7",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  noteCard:{
    backgroundColor:"white",
    padding:16,
    borderRadius:12,
    marginBottom:12,
    shadowColor:"#000",
    shadowOpacity:0.05,
    shadowRadius:6,
    elevation:2
  },

  title:{
    fontSize:18,
    fontWeight:"bold",
    marginBottom:4
  },

  bodyPreview:{
    color:"#666"
  },

  fab:{
    position:"absolute",
    right:20,
    bottom:30,
    backgroundColor:"#4a6cf7",
    width:60,
    height:60,
    borderRadius:30,
    alignItems:"center",
    justifyContent:"center",
    elevation:5
  },

  fabText:{
    color:"white",
    fontSize:30,
    fontWeight:"bold"
  },
  note: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  notetitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 15,
  },
  content: {
    marginTop: 20,
  },
  body: {
    fontSize: 18,
    lineHeight: 26,
    color: "#555",
  },

  deleteContainer: {
    marginBottom: 20,
  },

});