## Objectives
- Understand the landscape of Mobile Development .
- Learn about the Core concepts of React Native and the problems it solves.
- Create & Understand a React Native App.
## The Mobile Landscape
To understand why React Native is so powerful, we first need to look at how mobile applications are traditionally built and the challenges that developers face when trying to reach all users.
### The Native Approach
Historically, if we wanted to build an app for iPhones and an app for Android phones, we had to build two completely separate applications.
- For **iOS**, developers use languages like Swift or Objective-C and Apple's specific tools.
- For **Android**, developers use Java or Kotlin and Google's specific tools.

This meant hiring two different teams, writing the same logic twice, and fixing bugs in two different places. It was expensive, slow, and difficult to keep both apps perfectly in sync.
### The WebViews
To solve the problem of writing two apps, developers tried a shortcut: WebViews. A WebView is essentially a hidden, stripped-down web browser embedded inside a mobile app shell. Developers could build a standard website using HTML, CSS, and JavaScript, and just display it inside the app.   
While this allowed for a single codebase (multi-platform), it created a terrible user experience. The apps felt sluggish, didn't have access to all the device's hardware features, and lacked the smooth animations and interactions that users expect from a "real" mobile app. It was like trying to read a website through a keyhole.
### The React Native Model
React Native changes this entire pattern. Instead of wrapping a slow website in a WebView, or writing two completely separate native apps, React Native lets us write our application logic once in JavaScript and React.   
When the app runs, React Native doesn't render HTML web elements. Instead, it translates our JavaScript instructions into real, authentic native UI elements (like Android's `android.view.View` or iOS's `UIView`).   
This produces an experience that is smooth and fast. The application looks and behaves exactly like a traditional native app because, visually, it is a native app.
## Overview of React Native

### What is a Mobile Framework?
Building a modern, complex mobile app for multiple platforms from scratch is like building a skyscraper by forging every nut and bolt ourself.   
To solve this, developers use frameworks. Think of them as a toolkit and a set of blueprints. They provide pre-written, optimized code and a clear structure for handling common tasks like:
- Rendering native buttons and text.
- Managing the application's "state" (e.g., who is logged in).
- Navigating the user between different "screens."
### What is React Native?
React Native is a free, open-source framework for building mobile applications. Created and maintained by Meta (formerly Facebook), its primary goal is to make it easy to create fast, scalable, and interactive mobile UIs for both iOS and Android using a single codebase.  
Its main job is simple: take our data and turn it into the native visual elements we see on the screen.
### React Native's Core Concepts
React Native’s popularity comes from a few powerful ideas borrowed from standard React, adapted for mobile.
#### The Virtual DOM and the "Bridge"
Updating the actual screen on a mobile device can be resource-intensive. React Native solves this using the Virtual DOM and a communication layer often called the **Bridge**.    
The **Virtual DOM** is a lightweight, in-memory representation of the app’s user interface. It acts like a **digital blueprint** of the UI that React manages inside the JavaScript environment. Whenever the app’s data changes, React first updates this Virtual DOM and **compares the new version with the previous one** to determine the smallest possible change needed, instead of updating the entire interface. Once React knows exactly what needs to change, it sends those instructions through the **Bridge**, which works like a communication channel between the JavaScript side and the device’s native system. The bridge passes the specific update commands to the native platform (Android or iOS), and the device then applies those changes to produce the **Native UI**—the real interface users see and interact with on the screen.
#### Component-Based Architecture
A component is a small, reusable building block used to create the user interface. Instead of building the entire UI as one large structure, React Native breaks it into independent pieces called components, each responsible for a specific part of the interface.   
For example, a component could represent something simple like a button, or something more complex like a user profile card that includes an image, text, and a follow button. Each component manages its own structure and behavior, which makes the interface easier to organize and maintain.  
Developers can reuse and combine components to build larger sections of the app. Small components can form bigger UI sections (such as a post or profile card), and those sections can then be combined to create entire screens like a social media feed. This modular approach keeps the code organized, reusable, and easier to scale as the application grows.

#### Declarative UI
A declarative UI is an approach where developers describe what the interface should look like based on the current data, rather than manually describing every step needed to update it. In React Native, the UI is defined as a function of the application’s state.    
Instead of writing instructions for how to find elements, attach listeners, and update them step by step, developers simply declare the desired UI structure. For example, a developer can describe a list of items and tell React Native to render it. If the underlying data changes, React Native automatically determines what parts of the interface must update and applies those changes. This approach simplifies UI development by reducing manual updates and allowing developers to focus on describing the interface rather than managing every detail of how it changes.

### Who Uses React Native?
React Native is widely adopted by major technology companies to build cross-platform mobile applications that run on both Android and iOS from a shared codebase. Its performance, flexibility, and large ecosystem make it a reliable choice for production-scale apps used by millions of people.

Several well-known companies use React Native in their products, including **Meta** for applications such as Facebook and Instagram, **Microsoft** for products like Skype and parts of the Office ecosystem, **Shopify**, **Discord**, and **Pinterest**. Their adoption demonstrates how React Native can support large-scale, high-traffic applications while maintaining a unified development workflow across platforms.

## Creating & Understanding a React Native App
### Environment Setup
To create a React Native app, we need **Node.js** installed on our computer. We will also use the React Native CLI, which allows us to set up and manage a React Native project with full access to the native Android and iOS code.

### Creating the Project
After installing Node.js, we can create our first app using The terminal:
```
npx @react-native-community/cli init
```
This command will prompt us for the app name. After we set the name (`app1` for example ), it will create a new folder called `app1` that contains the app's base structure and installs all the required packages. Now, we can navigate to our new app folder:
```
cd app1
```

### Understanding the Project Structure
When we create a React Native app using the command `npx @react-native-community/cli init`, the command generates all the files needed to build and run our app. This includes native **iOS** and **Android** folders. Here’s a brief overview of the main parts of the folder structure:
#### `__tests__/`
This folder contains test files for the application. It’s where we can write unit tests or integration tests using Jest or other testing frameworks.
#### `.bundle/`
This folder is automatically generated and stores bundled JavaScript code used when building or running the app. Developers rarely interact with it directly.
#### `android/`
The `android` folder contains the native Android project, including Gradle build files, manifest files, Java/Kotlin code, and platform-specific configuration. This allows us to build and run our app directly on Android devices or emulators.
#### `ios/`
The `ios` folder contains the native iOS project, including Xcode project files, Swift/Objective-C code, and platform-specific settings. It allows the app to be built and run on iPhones or iPads.
#### `node_modules/`
This folder contains all installed JavaScript dependencies. It’s automatically managed by npm or yarn.
#### `.eslintrc.js` and `.prettierrc.js`
These files configure code quality and formatting rules using ESLint and Prettier to ensure consistency in the codebase.
#### `.gitignore`
Specifies files and folders that should not be committed to Git, like `node_modules`, logs, or build artifacts.
#### `.watchmanconfig`
A configuration file for Watchman, a file-watching service used to improve development performance on macOS/Linux.
#### `app.json`
Contains basic project configuration like the app name, display name, version, and other metadata.
#### `App.tsx` (or `App.js`)
The main entry point of your React Native app. This is where our root component lives, and it defines the initial UI and navigation setup.
#### `index.js`
The entry point for the JavaScript bundle, which registers the main App component with the native runtime.
#### `babel.config.js`
Configures Babel, the JavaScript compiler, to transform modern JavaScript/TypeScript syntax into code that can run on both iOS and Android.
#### `jest.config.js`
Configuration for **Jest**, the testing framework, defining how tests are run and which files to include.
#### `metro.config.js`
Configuration for **Metro**, the React Native bundler, which handles JavaScript bundling, asset resolution, and live reloading.
#### `package.json` & `package-lock.json`
`package.json` lists the project’s dependencies, scripts, and metadata, while `package-lock.json` locks the exact versions of installed dependencies for consistency across environments.
#### `README.md`
Contains documentation about the project, such as setup instructions and development guidelines.
#### `tsconfig.json`
Finally this file configures TypeScript settings, such as module resolution, strictness rules, and type-checking behavior.

### The TSX Syntax
When we open `App.tsx`, we will see something that looks similar to HTML inside a TypeScript file. This syntax is called **TSX**.  
React native apps are built TSX syntext because allows us to describe the user interface directly inside our TypeScript code. It combines UI structure with TypeScript logic, allowing us to build components while still using TypeScript features such as type annotations and type checking.   
Because we are building a native mobile application, React Native does not use traditional HTML elements like `<div>`, `<h1>`, or `<p>`. Instead, it provides its own set of core components that represent native UI elements.    
Common equivalents:
- `<div>` ➔ `<View>` A container for layout
- `<h1>` / `<p>` ➔ `<Text>` All text must be inside this
- `<button>` ➔ `<Button>` or `<Pressable>`
#### Example of TSX
Here example of TSX script
```tsx
import { View, Text } from "react-native";  
  
export default function App(): JSX.Element {  
  return (  
    <View>  
      <Text>Hello React Native</Text>  
    </View>  
  );  
}
```
#### Rules of TSX in React Native
TSX follows a small set of important rules when writing components in React Native.  
1. A component must return **one top-level element**. If multiple elements are needed, they must be wrapped inside a container such as `<View>`.
```tsx
// This wrong
return (  
<Text>Title</Text>  
<Text>Paragraph</Text>  
);
```
If we return many element we wrap them inside fragment  `<View> </View>` 
```tsx
return (  
<View>  
<Text>Title</Text>  
<Text>Paragraph</Text>  
</View>  
);
```
2. Use Curly Braces for TypeScript Expressions, Inside TSX, curly braces `{}` are used to insert **variables, expressions, or logic** into the UI.
```tsx
const name: string = "Alex";  
  
return (  
<Text>Hello {name}</Text>  
);
```
This allows us to combine TypeScript logic and UI structure in the same file, which is one of the core ideas behind React Native.

### Components, Hooks, and State
### Components
In React Native, the user interface is divided into components. A component is simply a function that returns TSX, which describes what should appear on the screen. By combining multiple components, we can build complex user interfaces from smaller, reusable pieces.  
```tsx
import { View, Text } from "react-native";  
  
function WelcomeMessage() {  
return (  
<View>  
<Text>Welcome to React Native</Text>  
</View>  
);  
}  
  
export default WelcomeMessage;
```

#### State
**State** is data that belongs to a component and can change over time. When the state changes, the component **re-renders**, updating what the user sees on the screen.   
State is commonly used for things like:
- User input
- Counters
- Toggle values
- Data loaded from an API

State is created using the **`useState` hook**.
#### Hook
Finally Hooks are special functions that allow components to use features such as state and lifecycle behavior.   
Hooks make it possible for functional components to manage data and react to changes without using classes. They help keep components simpler and easier to organize.   
One of the most commonly used hooks is **`useState`**, which allows a component to store and update data.
```tsx
import { View, Text, Button } from "react-native";  
import { useState } from "react";  
  
export default function Counter() {  
const [count, setCount] = useState<number>(0);  
  
return (  
<View>  
<Text>Count: {count}</Text>  
<Button title="Increase" onPress={() => setCount(count + 1)} />  
</View>  
);  
}
```
`useState<number>(0)` creates a piece of state with an initial value of `0`. It returns two values: `count`, which stores the current value of the state, and `setCount`, a function used to update that value. When `setCount` is called, the state changes and React Native automatically re-renders the component, updating the UI to reflect the new value.

### Creating Counter app
First, we clear everything inside `App.tsx` to start fresh. Next, we import the components we need from React Native: `View` to hold all the content, `Text` to display simple text and the current counter value, and `Button` to handle user clicks. We also import the `useState` hook from React to create a `count` state, which will keep track of how many times the buttons are clicked.
```tsx
import { View, Text, Button } from "react-native";  
import { useState } from "react";
```
Then, we create the `App` component, which represents the main screen of our app. Inside this component, we use `useState` to create the `count` state and initialize it to `0`.
```tsx
export default function App(){
	const [count, setCount] = useState<number>(0);
}
```
We  then return a `View` that contains a title, the current count displayed with `Text`, and two `Button` components one to increment and one to decrement the counter. 
```tsx
export default function App() {  
const [count, setCount] = useState<number>(0);  
  
return (  
<View>  
<Text>Counter App</Text>  
<Text>Count: {count}</Text>  
<Button title="Increment" />  
<Button title="Decrement" />  
</View>  
);  
}
```
The buttons don’t perform any actions by default. To make them interactive, we use the `onPress` event handler, which listens for when a button is clicked. The `onPress` prop takes a function, usually an arrow function, that defines what should happen when the button is pressed.
```tsx
<Button title="Increment" onPress={() => setCount(count + 1)} />
<Button title="Decrement" onPress={() => setCount(count - 1)} />
```
The full ``App.tsx`` file now will look as following
```tsx
import { View, Text, Button } from "react-native";  
import { useState } from "react";

export default function App() {  
const [count, setCount] = useState<number>(0);  
  
return (  
<View>  
<Text>Counter App</Text>  
<Text>Count: {count}</Text>  
<Button title="Increment" onPress={() => setCount(count + 1)} />
<Button title="Decrement" onPress={() => setCount(count - 1)} /> 
</View>  
);  
}
```
Each button updates the `count` state when pressed, and React Native automatically re-renders the UI to show the new value.
### Adding Styles
React Native doesn't use CSS files for styles. Instead, all styling is done using JavaScript objects, usually created with `StyleSheet.create()`. It uses CamelCase for property names and heavily relies on Flexbox for layout.

Lets, create a `styles` folder in our project and add a new file called `AppStyles.ts`, Inside `AppStyles.ts`, We define all our styles using `StyleSheet.create()`:
```ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: "#888",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row", // Place buttons side by side
  },
});

export default styles;
```
Finally, in `App.tsx`, we import the styles and apply them to our components using the `style` prop:
```tsx
import { View, Text, Button } from "react-native";  
import { useState } from "react";  
import styles from "./styles/AppStyles"; // Import external styles  
  
export default function App() {  
const [count, setCount] = useState<number>(0);  
  
return (  
<View style={styles.container}>  
<Text style={styles.title}>Counter App</Text>  
<Text style={styles.subtitle}>{count}</Text>  
<View style={styles.buttonContainer}>  
<Button title="Increment" onPress={() => setCount(count + 1)} />  
<View style={{ width: 15 }} />  
<Button title="Decrement" onPress={() => setCount(count - 1)} />  
</View>  
</View>  
);  
}
```
### Running React Native App on Android
We can run our app on both Android and iOS, but here we will focus on running the app on **Android**.
#### Install Java JDK
First, we need to install the **Java JDK**, which is required to compile the app. You can download it from [https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html), and it’s recommended to use a version between **17 and 20**. After installing, set the environment variable `JAVA_HOME` to point to your JDK folder, for example: `C:\Program Files\Java\jdk-17`, and add `%JAVA_HOME%\bin` to your system **Path** so that `java` commands can be run from any terminal.
#### Install Android Studio
Next, we need to download and install **Android Studio**. After installation, open Android Studio and navigate to Projects → More Actions → Virtual Device Manager. There, create a virtual device (emulator), choosing one with enough RAM and a resolution suitable for our PC. Finally, launch the emulator to ensure it boots successfully.
#### Configure Android Environment Variables
After that, we need to configure the  Environment Variables in our system, first we open Environment Variables we go to System Variables and add the following variables: `ANDROID_HOME` and `ANDROID_SDK_ROOT`, both pointing to our Android SDK folder, for example: `C:\Users\<YourUser>\AppData\Local\Android\Sdk`. 

Then, we edit the Path variable and add `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\emulator`. This setup ensures our system can access `adb` and other Android SDK tools.
#### Run The App
Finally, we start the emulator in Android Studio by clicking **Play ▶️** next to the virtual device. Then, we open the **React Native project folder** in a terminal and run:
```
npx react-native run-android
```
This command will build our project and install it on the emulator. If everything is set up correctly, we should see our app with two buttons: Increment and Decrement, and a counter displayed in the middle. If There is problems while running the app, we can use the command `npx react-native doctor` to check our setup and see what issues need to be fixed.