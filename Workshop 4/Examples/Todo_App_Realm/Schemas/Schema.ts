import Realm from "realm";  
  
export class Task extends Realm.Object<Task> {  
  _id!: Realm.BSON.ObjectId;  
  text!: string;  
  
  static schema = {  
    name: "Task",  
    primaryKey: "_id",  
    properties: {  
      _id: "objectId",  
      text: "string",  
    },  
  };  
}  