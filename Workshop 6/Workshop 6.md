## Objectives
- Sharing Data with Bluetooth
- Notifications and Background Tasks

## Bluetooth
The Bluetooth radio is a short-range wireless communication hardware that allows devices to connect and exchange data directly with one another without needing an internet connection. It enables peer-to-peer communication, making it possible to stream audio, send text messages like a terminal, or transfer files between devices, this can be helpfull on applications like:
- A **Smart Home app** sending commands to a lightbulb.
- A **Terminal app** sending and receiving text data to a custom hardware device (like an Arduino or Raspberry Pi).
- A **File Sharing app** sending images or videos to another phone.

### Working With Bluetooth
There are two main types of Bluetooth: **BLE (Bluetooth Low Energy)**, which is great for small, infrequent data (like heart rate monitors), and **Classic Bluetooth**, which is better for continuous data streams like terminal text or larger payloads.  
For a terminal application, we use Serial Port Profile (SPP) over Classic Bluetooth. A popular library for this is `react-native-bluetooth-classic`.

First we need first to install it using
```shell
npm install react-native-bluetooth-classic
```
After that, we make a small fix in the application configuration to request the necessary user permissions to scan for and connect to nearby Bluetooth devices. We open `android/app/src/main/AndroidManifest.xml` and add the following just above the `<application>` tag (handling both legacy and modern Android versions):
```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```
The Bluetooth Communication work first by scanning for paired or available devices nearby, After that a requests of connection is sent to a specific device's MAC address, Once connected, a "socket" is opened. The app can write data (send text) or listen for incoming data (read text). When finished, the app closes the socket to save battery.


#### Creating Terminal App
Let’s build a simple Terminal app that allows users to connect to a device and send a text message.

We start by importing our UI components and `RNBluetoothClassic`.
```tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList } from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
```
Next, we create our `TerminalScreen`. We need state variables to store our list of paired devices, the currently connected device, and the text the user wants to send.
```tsx
export default function TerminalScreen() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [message, setMessage] = useState('');
```
After that we use `useEffect`, to make small scan using `RNBluetoothClassic.getBondedDevices()`  to find devices already paired with the phone. and save them in state
```tsx
  useEffect(() => {
    async function getPairedDevices() {
      try {
        const paired = await RNBluetoothClassic.getBondedDevices();
        setDevices(paired);
      } catch (err) {
        console.error("Error fetching devices", err);
      }
    }
    getPairedDevices();
  }, []);
```
Next we create a function to connect to one of the discovered devices, we use `device.connect()` to etablish to **establish a Bluetooth connection** with the selected device and save thhe connected device in `connectedDevice` state
```tsx
  const connectToDevice = async (device) => {
    try {
      let connection = await device.connect();
      if (connection) {
        setConnectedDevice(device);
      }
    } catch (err) {
      console.error("Connection failed", err);
    }
  };
```
Once connected, we can send messages to the other device, we create simple function that send message using `device.write()` method
```tsx
  const sendMessage = async () => {
    if (connectedDevice) {
      await connectedDevice.write(message + '\r\n');
      setMessage(''); 
    }
  };
```
Finally we make our UI so the user can interect with our functions
```tsx
  return (
    <View style={{ padding: 20 }}>
      {!connectedDevice ? (
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Paired Devices</Text>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.address}
            renderItem={({ item }) => (
              <Button title={item.name} onPress={() => connectToDevice(item)} />
            )}
          />
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Connected to: {connectedDevice.name}
          </Text>
          <TextInput
            style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            placeholder="Type terminal command..."
            value={message}
            onChangeText={setMessage}
          />
          <Button title="Send" onPress={sendMessage} />
          <Button title="Disconnect" color="red" onPress={() => setConnectedDevice(null)} />
        </View>
      )}
    </View>
  );
}
```
## React Native App State
When users interact with our mobile application, they don't just stay on one screen forever. They switch to other apps, lock their phones, or swipe the app away completely. Understanding how our app behaves in these different scenarios is crucial.

React Native provides an API called `AppState` that tells us the current state of the application. The app can be in one of three states:
1. **`active`**: The app is running in the foreground and the user is interacting with it.
2. **`background`**: The app is running, but it is not visible. This happens when the user switches to another app or locks the phone screen without turning the device off.
3. **`inactive`**: A transitional state (mostly on iOS) when the app is moving between active and background, or during a system interruption like an incoming call.
### Listenning to App State
To monitor these changes, we import `AppState` from `react-native` and add an event listener. This is highly useful if we need to pause a video, save user data, or stop heavy calculations when the user leaves the app.
```tsx
import React, { useState, useEffect } from 'react';
import { AppState, Text, View } from 'react-native';

export default function AppStateExample() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('App State changed to:', nextAppState);
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Current State: {appState}</Text>
    </View>
  );
}
```
### Working with Background Tasks
Mobile operating systems such as iOS and Android are very strict about battery usage and memory management. Because of this, when an app goes into the background, the operating system will eventually pause its JavaScript execution. If the user completely closes the app (swipes it away), the app’s code stops running entirely.    
So how do apps like alarms or timers still work if the code is paused or the app is killed?

There are two main ways to handle this:
1. Run background tasks using native capabilities or specialized libraries which allow us to keep certain processes running in the background
2. Schedule local notifications, If the goal is only to notify the user at a specific time (for example, an alarm or reminder), we can schedule a local notification. The operating system handles the timing and displays the notification even if the app is in the background or closed.

Let’s explore how we can run a task in the background by building a simple app that plays a sound continuously and keeps playing it even when the app goes into the background.

To achieve this, we will use the library ``react-native-background-actions``, which allows us to run long-running tasks in the background on React Native apps.
```shell
npm install react-native-background-actions
```
We also need to install library to play sound
```shell
npm install react-native-sound
```
Android requires a foreground service to run long background tasks.  we need to add the following permission in `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="android.permission.WAKE_LOCK" />
```
After that we add the audio file we want to play inside `android/app/src/main/res/raw/beep.mp3`, so we can access it from our app.   
Now Lets create our program, first we start by including the library we need
```tsx
import React from 'react';  
import {View, Button, StyleSheet} from 'react-native';  
import BackgroundService from 'react-native-background-actions';  
import Sound from 'react-native-sound';
```
After that we set the Sound category which is essential for IOS to play audio when the app in the background, and `sound` variable which will hold the audio and play/stop it
```tsx
Sound.setCategory('Playback');
let sound: Sound | null = null;
```
Next we create the `initSound` function which creates a new `Sound` instance from the file `beep.mp3`. we give it `Sound.MAIN_BUNDLE` as second argument which tells the app to load the file from the app’s bundled resources
```tsx
const initSound = () => {
  if (!sound) {
    sound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) console.log('Failed to load sound', error);
    });
  }
};

```
After that we create the function that play the sound,it call the `initSound` function to set the sound variable and after that we use `sound?.play()` plays the audio.
```tsx
const playSound = () => {
  if (!sound) initSound();
  sound?.play((success) => {
    if (!success) console.log('Sound playback failed');
  });
```
Finally we create function that will run the background service, first it use while loop with `BackgroundService.isRunning()` as condition  to ensures it the service keeps looping while the background service is active.
```tsx
const backgroundTask = async () => {  
	while (BackgroundService.isRunning()) {  
		console.log('Playing sound...');  
		playSound(); 
                await new Promise(resolve => setTimeout(resolve, 500)); 
	}  
};
```
After that we create the object to have the service configuration
```tsx
const options = {
  taskName: 'MusicTask',
  taskTitle: 'Sound running',
  taskDesc: 'Playing sound in background',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
};
```
- `taskName`  internal name for the service.
- `taskTitle` title shown in the notification.
- `taskDesc` description in the notification.
- `taskIcon` icon displayed in the notification.
- `color` notification color.

Next inside our App component, we create two functions: one is responsible for starting the service, and the other for stopping it.
```tsx
export default function App() {
  const startService = async () => {
    await BackgroundService.start(backgroundTask, options);
  };

  const stopService = async () => {
    await BackgroundService.stop();
    if (sound) {
      sound.stop();
      sound.release();
      sound = null;
    }
  };
```
Finally we simple UI with two buttons to trigger those functions
```tsx
return (
    <View style={styles.container}>
      <Button title="Start Sound" onPress={startService} />
      <Button title="Stop Sound" onPress={stopService} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    gap:20
  }
});
```
### Notifications
Notifications are essential for keeping users informed about events in the application, even when they aren't actively looking at the screen. Broadly, we can categorize them into two main types based on how the user experiences them:
1. **Dialogue Notifications (In-App / Foreground):** These are alerts or modals that pop up immediately while the user is actively using the app. They require the user to click something to dismiss them or make a choice (like confirming an action or showing an error message).
2. **Background / System Notifications (Push & Local):** These are the classic notifications that appear in the device's notification center, drop down from the top of the screen, and often play a sound (like a new message, a game alert, or an alarm). They work even if the app is minimized or closed.

To handle background notifications, a robust and popular library in the React Native ecosystem is `@notifee/react-native`.

First, let's install it:
```shell
npm install @notifee/react-native
```
#### Creating a Clockwatch Timer App
Let’s build a simple Clockwatch app. The user will set a timer, and the app will confirm this with Dialogue Notification. It will then count down, and when the timer hits zero, it will trigger a Background Notification that plays a sound to let the user know time is up.

First, we import our standard UI components, the `Alert` component for our dialogue notification, and `notifee` for our background notification.
```tsx
import React, { useState} from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import BackgroundService from 'react-native-background-actions';
```
Next, we create our `TimerScreen`. We need state variables to track the number of seconds left, and a boolean to track if the timer is actively running.
```tsx
export default function TimerScreen() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [inputMinutes, setInputMinutes] = useState('');
  const [isRunning, setIsRunning] = useState(false);
```
After that we created the function that handel the background task of decrementing the timer, this function change the time lest value and check if, counting down is finished it call `stopService();` which stop the background service and set is runnig to 0 ,we also set the option for the background service.
```tsx
 const backgroundTask = async () => {
  while (await BackgroundService.isRunning()) {
    setTimeLeft(prev => {
      if (prev <= 1) {
        stopService();
        setIsRunning(false);
        return 0;
      }
      return prev - 1;
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};
  const options = {
  taskName: 'Stopwatch',
  taskTitle: 'Timer running',
  taskDesc: 'Running stopwatch in background',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
};
```
Now we create two functions that control our background service, `startService` start the background service , and `stopService` reset our states stop the background service, and call `triggerBackgroundNotification();`
```tsx
  const startService = async () => {
     await BackgroundService.start(backgroundTask, options);
  }
  const stopService = async () => {
    setIsRunning(false);
    setTimeLeft(0);
    await BackgroundService.stop();
    triggerBackgroundNotification();
  }
```
We also need to create the function to start the timer. Here is where we will use our Dialogue Notification. When the user clicks "Start", we immediately show an in-app alert confirming the action, we start by requestin permission for the notification, then we calculate the number of second based on user input, we set the states and display Dialogue notify user the stopwatch is started finally we run our service
```tsx
const startTimer =async () => {
    await notifee.requestPermission();
    const totalSeconds = parseInt(inputMinutes) * 60;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsRunning(true);
      Alert.alert(
        "Timer Set!",
        `Your clockwatch is set for ${inputMinutes} minutes.`,
        [{ text: "OK", onPress: () => console.log("Alert closed") }]
      );
      setInputMinutes('');
     startService();
    }
  };
```
We also need to create function to stop the service when user click cancel
```tsx
const stopTimer = async ( ) =>{
   await stopService();
 }
```
Now we create the create the `triggerBackgroundNotification` function, which fires the Background Notification. Android requires us to create a "Channel" to define how the notification behaves (like its priority and sound). We set `AndroidImportance.HIGH` so it pops up at the top of the screen and plays the default system notification sound.
```tsx
 const triggerBackgroundNotification = async () => {
    const channelId = await notifee.createChannel({
      id: 'timer-alerts',
      name: 'Timer Notifications',
      sound: 'default',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: '⏰ Time is up!',
      body: 'Your clockwatch timer has finished.',
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  };
```
Finally, we build the UI to let the user input the time and see the countdown. We'll add a helper function to format the remaining seconds into a clean `MM:SS` display.
```tsx
const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      {!isRunning && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Minutes"
            keyboardType="numeric"
            value={inputMinutes}
            onChangeText={setInputMinutes}
          />
          <Button title="Start Timer" onPress={startTimer} />
        </View>
      )}
      {isRunning && (
        <Button
          title="Cancel"
          color="red"
          onPress={stopTimer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
  timerText: { fontSize: 64, fontWeight: 'bold', marginBottom: 40, },
  inputContainer: { width: '100%', alignItems: 'center', gap: 15, },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, width: '50%', textAlign: 'center', fontSize: 18, borderRadius: 8, }
});
```
