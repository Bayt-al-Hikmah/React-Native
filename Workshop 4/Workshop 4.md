## Objectives
- Persistent Storage in React Native
## Persistent Data Storage in React Native
State management (Context API, Redux, Zustand) is excellent for managing how our app behaves while it's running. However, these solutions have a major limitation: they are stored in RAM (memory). When a user force-closes the app, restarts their phone, or the OS kills the process to save battery, all that state vanishes.  
**Persistence** solves this. It allows us to save data directly onto the device's physical storage. This ensures that when the user re-opens the app, their settings, authentication tokens, or offline cache are exactly where they left them.   
React Native itself does not include a built-in persistent storage engine out of the box. Instead, it relies on the bridge architecture (or JSI) to communicate with the native storage systems of iOS and Android. Because apps have different needs ranging from saving a simple "Dark Mode" preference to storing thousands of complex relational records offline there are various ways to achieve this.

Let's explore the most prominent tools and libraries available for persistent storage in React Native
### AsyncStorage
AsyncStorage is the most common, fundamental key-value storage system for React Native. It operates asynchronously, meaning it won't block the main thread while reading or writing data. It stores data strictly as strings, so complex data types (like objects or arrays) must be converted using `JSON.stringify()` before saving and `JSON.parse()` after reading.

It is perfect for lightweight data: user preferences, theme settings, or simple session tokens. However, it is not recommended for storing large datasets or heavy relational data due to performance constraints.

To use AsyncStorage we first install the package.
```shell
npm install @react-native-async-storage/async-storage@2
```
AsyncStorage is built around **four main methods** that let us manage data in a key-value style. 
- `setItem` Store a value under a specific key.
- `getItem` Get the value stored under a key.
- `removeItem `Remove a specific key and its value.
- `clear` Remove everything stored in AsyncStorage.

Since `AsyncStorage` is asynchronous, all its methods return promises. The best way to work with it in a React component is by handling these promises inside a `useEffect` hook.
#### Example
Let’s update our `Todo_App` from `Workshop 2` to use persistent data storage. To do this, we first need to install the `AsyncStorage` library.  
```shell
npm install @react-native-async-storage/async-storage@2
```
After installing, we modify the `App.tsx` file. We start by importing the library, 
```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
```
After that , inside the ``App`` component, we create two `useEffect` hooks:
The first `useEffect` loads the list of items when the app starts.
```tsx
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
```
The second `useEffect` updates the stored data whenever any changes occur in the ``tasks`` list.
```tsx
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
```
With this small update, our app becomes more persistent. Closing the app or restarting the phone will no longer clear the data.
### MMKV
While AsyncStorage is great for basic needs, it can be slow. MMKV is an exceptionally fast, highly efficient key-value storage framework originally developed by WeChat. It uses memory-mapped files under the hood, making it up to 30x faster than AsyncStorage.    
Unlike AsyncStorage, MMKV is synchronous. We don't need to use `async/await` to read or write data, which makes our code cleaner and our app's performance significantly smoother.   
Another advantage of MMKV is that it supports **multiple data types directly** (strings, numbers, booleans, and objects), removing the need for manual serialization in many cases.

To use MMKV in a React Native project we install the package:
```shell
npm install react-native-mmkv react-native-nitro-modules
```
MMKV offer more methods to work with data:
- `set(key, value)`  Store a value.
- `getString(key)`  Retrieve a string.
- `getNumber(key)` Retrieve a number.
- `getBoolean(key)` Retrieve a boolean.
- `delete(key)` Remove a specific key.
- `clearAll()` Remove all stored data.
#### Example
Let’s make `Todo_App`  `MMKV` instead of  `AsyncStorage`, first  in top of our file we import `createMMKV` and create an instance of the storage object.
```tsx
import  { createMMKV } from "react-native-mmkv";

const storage = createMMKV();
```
Next, we edit the **first `useEffect`**. We retrieve the stored value using `getString`. If nothing is stored yet, we return an empty array (`'[]'`) as a default value. Then we parse the string and update the `tasks` state.
```tsx
  useEffect(() => {
    const storedTasks = storage.getString("tasks") || '[]';
    setTasks(JSON.parse(storedTasks));
  },[]);
```
the second `useEffect`, we save the tasks every time the `tasks` state changes.  
Using `storage.set`, we store the updated list by converting it into a string with `JSON.stringify`.
```tsx
useEffect(() => {
    storage.set("tasks", JSON.stringify(tasks));
  }, [tasks]);
```
We can see how MMKV is easier to work with than AsyncStorage. Since its API is synchronous, we no longer need `async` functions, `await`, or additional error-handling blocks just to read or write data.
### Realm
While simple key-value storage solutions like AsyncStorage or MMKV work well for lightweight data, some applications require a more powerful way to manage complex data. Realm is a mobile database designed specifically for high-performance apps. Instead of storing raw key-value pairs, Realm lets us work with structured objects, similar to working with models in a traditional database.

One of Realm’s biggest advantages is that it is object-based. We define schemas (data models), and Realm automatically handles storing and retrieving those objects. This makes it ideal for apps that manage structured data such as lists, user profiles, or relationships between objects.

Realm is also extremely fast because it stores data in a native database engine optimized for mobile devices. It supports features like live queries, meaning that when data changes, the UI can automatically update without manual state management.

To use Realm in a React Native project we install the package:
```shell
npm install realm
```
After installing the packages we need to declare our **schema**, which defines the structure of the data that will be stored in the Realm database. A schema describes what fields an object has, their data types, and any relationships with other objects.   
The schema acts like a blueprint for our data.  
It tells Realm:
- What objects exist in the database
- What properties (fields) those objects have
- The data type of each property
- Which field is the primary key
- Whether a field is optional
#### Creating Schema
Lets defines a data model (schema) for a task in Realm Database using TypeScript classes. The class describes how a Task object will be stored in the database.
```ts
import Realm from "realm";  
  
class Task extends Realm.Object<Task> {  
  _id!: Realm.BSON.ObjectId;  
  text!: string;  
  completed!: boolean;  
  
  static schema = {  
    name: "Task",  
    primaryKey: "_id",  
    properties: {  
      _id: "objectId",  
      text: "string",  
      completed: "bool",  
    },  
  };  
}  
```
First, we imported Realm from the Realm Database package so we can use its database features inside our application. After that, we create a class called **Task** that extends `Realm.Object`.
```ts
import Realm from "realm";  
  
class Task extends Realm.Object<Task> {  
}
```
Next we defined three fields: `_id` (a unique `ObjectId`), `text` (a string describing the task), and `completed` (a boolean indicating if the task is done). The `!` in TypeScript shows that Realm will initialize these fields. These type declarations help TypeScript understand the kind of data each property holds.
```ts
_id!: Realm.BSON.ObjectId;  
text!: string;  
completed!: boolean;
```
After declaring the fields, we define a **static schema** for the class. This schema tells Realm how the data should be stored in the database. The `name` property specifies the name of the collection, which is `"Task"`. The `primaryKey` is set to `_id`, meaning this field uniquely identifies each record. Finally, inside `properties`, we define the data types of each field using Realm’s type system (`objectId`, `string`, and `bool`).
```ts
 static schema = {  
    name: "Task",  
    primaryKey: "_id",  
    properties: {  
      _id: "objectId",  
      text: "string",  
      completed: "bool",  
    },  
  };
```
#### Interecting with The Database
Once the schema is defined, the next step is to **open the Realm database**. We do this by creating a new `Realm` instance and passing it a configuration object with two main properties: `schema`, which is the array of schemas to be used (in this case, the Task schema we defined earlier), and `schemaVersion`, which is a number representing the version of the schema. The `schemaVersion` is important because it allows Realm to handle **migrations** if the schema changes in the future.
```ts

import Realm from "realm";  
  
const realm = new Realm({  
  schema: [Task.schema], // Pass the Task schema  
  schemaVersion: 1,      // Version for future migrations  
});
```
Once the Realm instance is created, we can start working with data using CRUD operations: creating, reading, updating, and deleting Task objects.

- **Creating a Task** involves using a **write transaction** with `realm.create`, providing a unique `_id`, a `text` description, and a `completed` status:
```ts

realm.write(() => {  
  realm.create("Task", {  
    _id: new Realm.BSON.ObjectId(),  
    text: "Finish mobile development lecture",  
    completed: false,  
  });  
});
```
- **Reading Tasks** is done using `realm.objects("Task")`, which returns a live collection of all tasks. You can filter this collection to get specific tasks:
```ts
const allTasks = realm.objects("Task");  
const incompleteTasks = allTasks.filtered("completed == false");
```
- **Updating a Task** also requires a write transaction. You can find a task and modify its properties, and Realm will automatically persist the changes:
```ts
realm.write(() => {  
  const task = realm.objects("Task").filtered('text == "Finish mobile development lecture"')[0];  
  if (task) {  
    task.completed = true;  
  }  
});
```
- **Deleting a Task** uses a similar write block:
```ts
realm.write(() => {  
  const task = realm.objects("Task").filtered('text == "Finish mobile development lecture"')[0];  
  if (task) {  
    realm.delete(task);  
  }  
});
```
### SQLite
While object-based databases like Realm are fantastic for seamless object management, sometimes our application requires the power, structure, and flexibility of a traditional relational database. SQLite is a lightweight, embedded SQL database engine that lives directly on the mobile device. Instead of storing data as objects, SQLite stores data in tables with rows and columns, making it ideal for apps that require complex data relationships, advanced querying, or for developers who want to leverage their existing SQL knowledge.

One of SQLite’s biggest advantages is its ubiquity and reliability. It uses standard SQL syntax, meaning we can perform complex `JOIN` operations, precise filtering, and aggregations that might be more cumbersome in simple key-value stores.

To use SQLite in a React Native project, we typically install a wrapper like `react-native-sqlite-storage`:
```shell
npm install react-native-sqlite-storage
```
After installing the package, instead of declaring a class-based schema like we did in Realm, we use SQL queries to define the structure of our tables. We still need to describe what columns exist, their data types, and the primary key.

It tells SQLite:
- What tables to create
- What columns (fields) belong to those tables
- The data type of each column (e.g., `INTEGER`, `TEXT`)
- Which column is the primary key and if it auto-increments
#### Setting Up and Creating Tables
Let's define a data model for a task in SQLite. First, we need to open a connection to the database and then execute a `CREATE TABLE` query.
```ts
import SQLite from 'react-native-sqlite-storage';

// Enable promises for a cleaner, modern async/await syntax
SQLite.enablePromise(true);

const getDBConnection = async () => {
  return SQLite.openDatabase({ name: 'task-app.db', location: 'default' });
};

const createTables = async (db: SQLite.SQLiteDatabase) => {
  const query = `
    CREATE TABLE IF NOT EXISTS Task (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    );
  `;
  await db.executeSql(query);
};
```
First, we imported our SQLite package and enabled promises so we can use `async/await` instead of standard callbacks. We created a `getDBConnection` function that opens (or creates) a database file called `task-app.db`.   
Next, we defined our table creation logic. The `CREATE TABLE IF NOT EXISTS` statement ensures we only create the table the first time the app runs.
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
text TEXT NOT NULL,
completed INTEGER DEFAULT 0
```
Inside the query, we defined three columns: `id` (an integer that automatically counts up for every new record, serving as our unique identifier), `text` (a required string), and `completed` (an integer functioning as a boolean, where `0` is false and `1` is true).

#### Interacting with The Database
Once the database is opened and the table is created, we can start working with our data using standard SQL CRUD operations: `INSERT`, `SELECT`, `UPDATE`, and `DELETE`.
- **Creating a Task** involves executing an `INSERT INTO` query. We pass our dynamic values as an array in the second argument to prevent SQL injection:
```ts
const addTask = async (db: SQLite.SQLiteDatabase, taskText: string) => {
  const query = `INSERT INTO Task (text, completed) VALUES (?, ?)`;
  await db.executeSql(query, [taskText, 0]);
};

// Usage:
// await addTask(db, "Finish mobile development lecture");
```
- **Reading Tasks** is done using a `SELECT` statement. This returns a result set containing rows of data that we can loop through and format into a standard JavaScript array:
```ts
const getTasks = async (db: SQLite.SQLiteDatabase) => {
  const tasks: any[] = [];
  const results = await db.executeSql(`SELECT * FROM Task`);
  
  results.forEach(result => {
    for (let index = 0; index < result.rows.length; index++) {
      tasks.push(result.rows.item(index));
    }
  });
  
  return tasks;
};
```
- **Updating a Task** involves an `UPDATE` query. You specify which table to update, what values to set, and use a `WHERE` clause to target the specific row:
```ts
const completeTask = async (db: SQLite.SQLiteDatabase, taskId: number) => {
  const query = `UPDATE Task SET completed = 1 WHERE id = ?`;
  await db.executeSql(query, [taskId]);
};
```
- **Deleting a Task** works similarly to updating, but uses the `DELETE FROM` statement alongside a `WHERE` clause to remove the record entirely:
```ts
const deleteTask = async (db: SQLite.SQLiteDatabase, taskId: number) => {
  const query = `DELETE FROM Task WHERE id = ?`;
  await db.executeSql(query, [taskId]);
};
```
#### Using an ORM with SQLite
While writing raw SQL queries works, it can get repetitive and error-prone, especially as our app grows. ORMs (Object-Relational Mappers) simplify working with relational databases by letting us interact with tables as JavaScript/TypeScript objects instead of raw SQL.   
There are two dominant ORMs commonly used with SQLite in React Native:    
**Prisma**
- Modern, type-safe, and schema-driven.
- Lets you define your database schema in a single `schema.prisma` file.
- Generates a fully typed client for TypeScript, making database queries easy and predictable.
- Excellent for developers who like explicit type safety and modern tooling.
- Works not just with SQLite, but also PostgreSQL, MySQL, and more.

**TypeORM**
- Classic ORM with strong TypeScript support.
- Lets you define **entities as classes**, similar to Realm, making it feel object-oriented.
- Supports relationships, migrations, and complex queries with minimal SQL.
- Great for developers who want the traditional ORM pattern with decorators and repository-based data access.