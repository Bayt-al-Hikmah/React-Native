

## Objectives
- Working with Gestures

## Gestures
When designing for desktop, our primary interaction tools are the mouse and keyboard. We point, click, hover, and type. But mobile interaction is fundamentally different. A smartphone screen is an intimate, tactile canvas where users physically touch the interface. We don’t just click; we tap, drag, swipe, pinch, and rotate.

These physical interactions are called gestures, and they are the core of how users navigate and control mobile applications. While static screens provide the layout, and animations provide the visual feedback, gestures are the inputs that bring a mobile application to life.

React Native provides basic touch-handling components out of the box, like `TouchableOpacity` or `Pressable`. While these are great for simple buttons, they struggle with continuous, complex movements like swiping to delete an email or pinching to zoom into a photograph. To handle these fluidly, we need a dedicated gesture system.

### React Native Gesture Handler
The industry standard for managing complex touches in React Native is a community-driven library called `react-native-gesture-handler`. It completely replaces React Native's built-in touch system with a native-driven approach.

When paired with `react-native-reanimated`, gesture events are sent directly to the native UI thread. This means our app can track a user's finger as it drags across the screen at a perfect 60 frames per second, without ever waiting for the JavaScript thread to catch up.

To use the modern declarative API, we utilize two main tools:
1. **`Gesture`**: An object used to define what type of movement we are listening for (e.g., `Gesture.Pan()`, `Gesture.Tap()`).
2. **`<GestureDetector>`**: A wrapper component that attaches the gesture logic to our UI elements.

The ``react-native-gesture-handler`` library doesn't come packed with the standard setup, so we need to install it using
```shell
npm install react-native-gesture-handler
```
Let's explore the primary types of gestures and how to implement them.
### The Tap Gesture

While a standard press is simple, the Tap gesture allows for advanced configurations, such as detecting double-taps, tracking the exact X and Y coordinates of the finger, or setting a maximum duration for the tap.

Let's build a classic "Double Tap to Like" interaction, similar to what we see on social media platforms.
```tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';

export default function DoubleTapLike() {
  const scaleAnim = useSharedValue(1);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      scaleAnim.value = withSequence(
        withSpring(1.5),
        withSpring(1)
      );
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={doubleTap}>
        <Animated.View style={[styles.box, animatedStyle]} />
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  box: { width: 150, height: 150, backgroundColor: "tomato", borderRadius: 20 },
});
```
We first wraped our entire gesture area in a `GestureHandlerRootView`. This is required for the library to capture touches correctly, After that we defined our gesture using `Gesture.Tap().numberOfTaps(2)`. This tells the handler to ignore single taps and only trigger when two rapid taps occur, Inside the `.onStart()` callback, we update a Reanimated `useSharedValue`. We use `withSequence` to scale the box up to ``1.5x`` and then immediately spring it back to ``1x``, creating a "heartbeat" pop effect.

 Finally we wraped our `Animated.View` inside the `<GestureDetector>` and pass our `doubleTap` configuration to its `gesture` prop.


### The Pan Gesture 
A "Pan" gesture tracks continuous movement across the screen. It is the foundation for dragging objects, swiping through image carousels, or pulling a screen down to refresh its content.  
Using the `PanGestureHandler` from **react-native-gesture-handler**, we can detect the direction, velocity, and distance of a swipe to trigger corresponding actions.
#### Swipe Gestures
A **swipe** is a horizontal or vertical drag motion. Swipes are commonly used for navigation, dismissing notifications, or changing screens.   
A great way to showcase swipe gestures is a **“product swipe”** interface. This uses rotation and horizontal translation to decide if an item is **liked** (swiped right) or **dismissed** (swiped left). Users can swipe through different products, giving a smooth and interactive experience.
```tsx
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {  useSharedValue, useAnimatedStyle, withSpring,
  withDelay,
  withTiming,
  interpolate,
  useAnimatedProps
} from 'react-native-reanimated';

import { TextInput } from 'react-native';
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

export default function SwipeCardExample() {
  const translateX = useSharedValue(0);
  const statusText = useSharedValue("Swipe to Decide");
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        statusText.value = "LIKED ❤️";
        translateX.value = withSpring(width);
        setTimeout(() => {
          translateX.value = 0;
          statusText.value = "Swipe to Decide";
        }, 500);
      } else if (event.translationX < -SWIPE_THRESHOLD) {

        statusText.value = "DISMISSED ❌";
        translateX.value = withSpring(-width);
        setTimeout(() => {
          translateX.value = 0;
          statusText.value = "Swipe to Decide";
        }, 500);
      } else {
        translateX.value = withSpring(0);
      }
    });
  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: statusText.value,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-10, 0, 10]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate}deg` }
      ],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <AnimatedTextInput
        underlineColorAndroid="transparent"
        editable={false}
        value={statusText.value}
        style={styles.statusLabel}
        animatedProps={animatedTextProps}
      />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <TextInput editable={false} style={styles.cardTitle}>New Candidate</TextInput>
          <View style={styles.imagePlaceholder} />
          <TextInput editable={false} style={styles.cardDescription}>Swipe right to hire, left to skip.</TextInput>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5', },
  statusLabel: {
    position: 'absolute',
    top: 100,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    width: '100%',
  },
  card: {
    width: width * 0.8,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,

  },
  cardTitle: { fontSize: 22,fontWeight: 'bold',color: '#000',},
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#e1e4e8',
    borderRadius: 10,
  },
  cardDescription: { textAlign: 'center', color: '#666',}
});
```
We first wrapped our entire swipe area in a `GestureHandlerRootView`. This is required for the library to capture touches correctly. After that, we defined our gesture using `Gesture.Pan()`. This tells the handler to track continuous horizontal movement across the screen.

Inside the `.onUpdate()` callback, we update a Reanimated `useSharedValue` called `translateX`. This value represents how far the card has been dragged and is used to animate the card’s position and rotation.

Inside the `.onEnd()` callback, we check if the swipe passes the `SWIPE_THRESHOLD`. If it does, we update another shared value, `statusText`, to `"LIKED ❤️"` or `"DISMISSED ❌"`, and use `withSpring()` to fly the card off-screen. We then reset both the card position and the text after a short delay using `setTimeout`.

We created an animated component using `Animated.createAnimatedComponent(TextInput)`. This allows us to update the status text directly on the UI thread using `useAnimatedProps`, keeping the animation smooth and responsive.

Finally, we wrapped our `Animated.View` card inside a `<GestureDetector>` and passed our `panGesture` configuration to its `gesture` prop. The `useAnimatedStyle` hook is used to rotate the card as it moves, giving a natural swiping tilt effect.
#### Drag & Drop Gestures
A **drag** is a continuous movement of an element on the screen. Drag gestures are commonly used for moving objects, controlling joysticks, or interactive sliders.  
A great way to showcase drag gestures is a **joystick interface**. Users can drag the knob inside a circular area, and we show **X and Y values** ranging from -1 to 1. This gives a smooth and interactive control experience.

```tsx
import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {  useSharedValue, useAnimatedStyle, withSpring, useAnimatedProps } from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const JOYSTICK_RADIUS = 80;

export default function JoystickExample() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const distance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      const angle = Math.atan2(event.translationY, event.translationX);
      const radius = Math.min(distance, JOYSTICK_RADIUS);
      translateX.value = radius * Math.cos(angle);
      translateY.value = radius * Math.sin(angle);
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedProps = useAnimatedProps(() => {
    const normX = Math.round((translateX.value / JOYSTICK_RADIUS) * 10) / 10;
    const normY = Math.round(-(translateY.value / JOYSTICK_RADIUS) * 10) / 10;
    return {
      text: `X: ${normX}  Y: ${normY}`,
    };
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <AnimatedTextInput
        editable={false}
        style={styles.statusLabel}
        animatedProps={animatedProps}
      />
      <View style={styles.joystickBase}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.knob, animatedStyle]} />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
  statusLabel: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 40, textAlign: 'center', width: '80%' },
  joystickBase: {
    width: JOYSTICK_RADIUS * 2,
    height: JOYSTICK_RADIUS * 2,
    borderRadius: JOYSTICK_RADIUS,
    backgroundColor: '#e1e4e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  knob: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'dodgerblue',},
});
```
The joystick follows our finger when we press and drag it, and when we release it, it smoothly returns to the center. To achieve this, in the `.onUpdate()` callback we update the `translateX` and `translateY` properties of the knob.

We first calculate the **distance** and **angle** of the drag to determine the knob’s position within the circular boundary. Using these, we compute the X and Y coordinates of the knob.

Finally, we normalize these coordinates to values between **-1 and 1** and display them in real-time using the animated text input. This gives users a smooth, interactive joystick experience with immediate feedback on both axes.
### The Pinch Gesture 
Pinch gestures track the distance between two fingers on the screen. Moving fingers apart indicates a zoom-in action, while pinching them together indicates zooming out.    
Using `Gesture.Pinch()`, the library provides us with a `scale` value inside the event object. If the fingers move apart, the scale goes above 1.0. If they move together, it drops below 1.0.  
Just like the Pan gesture, we capture this scale inside an `.onUpdate()` callback and feed it into a shared value, which is then mapped to the `scale` property in our `useAnimatedStyle`. This is how we build pinch-to-zoom functionality for image viewers or maps.  

Lets build simple box that can be scaled and rotated using our fingers
```tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

export default function PinchRotateSquare() {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedRotation = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, rotationGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.square, animatedStyle]} />
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5',},
  square: {
    width: 150, height: 150, backgroundColor: 'dodgerblue', borderRadius: 20,
  },

});
```
We used two different gestures: a `Pinch` gesture to control the scale of the square and a `Rotation` gesture to control its rotation. Each gesture updates its own shared value using `useSharedValue`, which is then applied to the square through `useAnimatedStyle`.   
To allow both gestures to work at the same time, we combined them using `Gesture.Simultaneous()`. This creates a composed gesture that listens to both the pinch and rotation gestures simultaneously, so the user can zoom and rotate the square in a single interaction.   
We also store the last transformation using `savedScale` and `savedRotation`. When the gesture ends, these values are updated so the next gesture continues from the current scale and rotation instead of resetting.



## Device Sensors and Permissions
When designing for the web, our applications live inside the browser sandbox. But a mobile device is a physical piece of hardware packed with sensors that can see, hear, track location, and feel movement. By accessing these native device features, we elevate our app from a static interface to an intelligent, context-aware experience.

However, with great power comes strict security boundaries. Before we can access any of these sensors, we must navigate the operating system's permission system.

### Understanding Permissions
Mobile operating systems (iOS and Android) act as strict gatekeepers for user privacy. We cannot secretly turn on the microphone or track a user's location; we must explicitly ask for their consent.   
Handling permissions requires a three-step dance:

- **Checking Status:** Checking if the user has already granted or denied the permission.
- **Requesting Access:** Triggering the native OS modal prompting the user to allow or deny access.
- **Handling the Response:** Gracefully degrading the app's functionality if the user says "No," or proceeding with the feature if they say "Yes."

Let's explore the primary sensors, how to implement them, and how to manage their specific permissions.
### The Accelerometer
The accelerometer is an electromechanical sensor that measures acceleration forces. It tells us how the phone is moving or tilting in three-dimensional space by tracking the X (horizontal), Y (vertical), and Z (depth) axes.   
To work with the accelerometer, we commonly use the library ``react-native-sensors``, which provides access to device sensors such as the accelerometer, gyroscope, and magnetometer.  

To work with this library we need first to install it using
```shell
npm install react-native-sensors
```
After that we make small fix in the module the module configuration, we open `node_modules/react-native-sensors/android/build.gradle` and replace `jcenter()` with `mavenCentral()`   

Now lets demonstrate, how the Accelerometer work by building an interactive app where a ball moves based on the physical tilt of the device.


```tsx
import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const BALL_SIZE = 50;

export default function AccelerometerApp() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 16);
    const subscription = accelerometer.subscribe(({ x, y }) => {
      translateX.value = withSpring(x * (width / 2));
      translateY.value = withSpring(-y * (height / 2));
    });
    return () => subscription.unsubscribe();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ball, animatedStyle]} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    backgroundColor: 'tomato',
    borderRadius: BALL_SIZE / 2,
  },
});
```
First,  we imported the accelerometer sensor from `react-native-sensors`, and animation utilities from `react-native-reanimated`. Inside the `AccelerometerApp` component, we create two shared animated values `translateX` and `translateY` to control the ball’s position. 
In `useEffect`, we configure and start listening to the **accelerometer sensor**, which detects how the device moves or tilts. First, `setUpdateIntervalForType(SensorTypes.accelerometer, 16)` sets how often the sensor sends data updates. The value **16 milliseconds** means the app receives data about **~60 times per second**, which makes the movement appear smooth and responsive. Then we create a **subscription** using `accelerometer.subscribe(...)`. This function continuously listens for accelerometer readings and returns an object containing values such as `x` and `y`. These values represent the device’s acceleration along the horizontal and vertical axes. Inside the subscription callback, we use these values to update the animated positions `translateX` and `translateY`, which control the ball’s movement on the screen.

Finally, the `useEffect` cleanup function returns `subscription.unsubscribe()`, which stops listening to the sensor when the component unmounts, preventing memory leaks and unnecessary sensor usage.
### The GPS Sensor
The GPS (Global Positioning System) sensor is a navigation mechanism that determines the device's exact geographical location. It tells us where the phone is located on Earth by communicating with satellites to  track and  determine the device's exact geographical coordinates like latitude, longitude, speed, and heading.

To work with the GPS, we commonly use the library ``@react-native-community/geolocation``, which provides an easy-to-use API to access the device's location services.  
To work with this library we need first to install it using
```shell
npm install @react-native-community/geolocation
```
After that we make a small fix in the application configuration to request user permissions. We open ``android/app/src/main/AndroidManifest.xml`` and add 
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
``` 
just above the ``<application>`` tag.

Now let's demonstrate how the GPS sensor works by building an interactive app that continuously tracks and displays the user's live coordinates on the screen.
```tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text,TextInput, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedProps } from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function GpsApp() {
  const Latitude = useSharedValue(0);;
  const Longitude = useSharedValue(0);;

  useEffect(() => {
    const rnuaS36WH7sd4q7Xu9BLw99hr18JFEQz21 = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

          {
            title: "Location Permission",
            message: "App needs access to your location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
  
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Location permission denied");
          return;
        }
      }

      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("GPS Data:", position.coords);
          Latitude.value = latitude ?? 0;
          Longitude.value=longitude?? 0;
        },
        (error) => {
          console.log("GPS ERROR:", error);
          Latitude.value = -1;
          Longitude.value= -1;
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 1000,
          fastestInterval: 10,
        }
      );
      return () => Geolocation.clearWatch(watchId);
    };

     rnuaS36WH7sd4q7Xu9BLw99hr18JFEQz21();
  }, []);


  return (
    <Animated.View style={styles.container}>
      <Text style={styles.title}>Live GPS Tracking</Text>
      <View style={styles.card}>
        <AnimatedTextInput
        underlineColorAndroid="transparent"
        editable={false}
        value={Longitude.value.toString()}
        style={styles.text}
         animatedProps={useAnimatedProps(() => {
    return {
      text: "Longitude: " + Longitude.value.toFixed(3).toString(),
      };
    })}
      />
        <AnimatedTextInput
        underlineColorAndroid="transparent"
        editable={false}
        value={Latitude.value.toString()}
        style={styles.text}
        animatedProps={useAnimatedProps(() => {
    return {
      text: "Latitude: " + Latitude.value.toFixed(3).toString(),
      };
  })}
      />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  card: {
    padding: 20,
    backgroundColor: '#3b4048',
    borderRadius: 10,
    width:"80%"
  },
  text: {
    fontSize: 18,
    color: 'tomato',
  },
});
```
First, we imported Geolocation from ``@react-native-community/geolocation``, along with utility components for handling UI and permissions. Inside the ``GpsApp`` component, we create two shared values  to store and update the current latitude and longitude.

In ``useEffect``, we configure and start listening to the GPS sensor. First, we run an asynchronous function to ask the user for location permissions. Then we create a subscription using ``Geolocation.watchPosition(...)``. This function continuously listens for GPS readings. We pass it a configuration object ``{ enableHighAccuracy: true, distanceFilter: 1, interval: 1000 }``, which tells the sensor to use the most accurate GPS hardware, update whenever the user moves by at least 1 meter, and fetch data every 1000 milliseconds. Inside the success callback, we take the latitude and longitude from the ``position.coords`` object and update our shared values.

Finally, the useEffect cleanup function returns Geolocation.clearWatch(watchId), which tells the GPS sensor to stop tracking the user's location when the component unmounts, saving battery life and preventing memory leaks.
#### The Map
The map component allows us to render interactive geographical data directly inside our application. It enables us to visualize locations, track movements, draw routes, and drop customizable pins (markers) in a two-dimensional visual space.

To work with maps, we commonly use the library react-native-maps, which provides native map components for both iOS (Apple Maps or Google Maps) and Android (Google Maps).

To work with this library we need first to install it using
```
npm install react-native-maps
```
After that we make a small configuration step to enable Google Maps on Android. We open ``android/app/src/main/AndroidManifest.xml`` and insert our Google Maps API key inside the ``<application>`` block by adding: 
```
<meta-data android:name="com.google.android.geo.API_KEY" android:value="YOUR_GOOGLE_MAPS_API_KEY"/>.
```
You can get the api key from google cloud platform   
Now let's demonstrate how Maps work by building an interactive app that displays a map centered on a specific location with a custom marker.

```tsx
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapApp() {
  const [region, setRegion] = useState({
    latitude: 36.7314, 
    longitude: 3.0898,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        <Marker
          coordinate={{ latitude: 36.7314, longitude: 3.0898 }}
          title="Kouba"
          description="Algiers Province, Algeria"
          pinColor="tomato"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
```
First, we imported ``MapView`` and ``Marker`` from ``react-native-maps``, the MapView component responsible for displaying the map in the app, it use``initialRegion`` prop so the map knows where to center when the app loads, The region object requires latitude and longitude (the center point of the map), alongside latitudeDelta and longitudeDelta which control the zoom level by determining how much area is visible on the screen. 

We used the ``onRegionChangeComplete`` event listener, to update our region state whenever the user stops panning or zooming, ensuring our app always knows exactly what the user is looking at.

Inside the ``MapView``, we render a ``Marker`` component. This places a physical pin on the map at the exact coordinates provided in the coordinate prop. We configure it with a title, a description (which appears when the user taps the pin), and a custom ``pinColor`` to match the theme of our application, To add additional markers, we simply provide different coordinates in the `coordinate` prop for each new `Marker`, allowing multiple locations to be displayed on the same map.
### The Microphone and Headphones
The microphone is an acoustic-to-electric sensor that captures sound waves from the user's environment and converts them into digital audio data. Conversely, headphones or the device's internal speaker handle the reverse process, translating those digital signals back into audible sound.

To work with audio recording and playback, we commonly use the library `react-native-audio-recorder-player`, which provides a robust API to capture audio from the microphone and play it back through the headphones or speakers.   
To work with this library we need first to install it using
```shell
npm install react-native-nitro-modules react-native-nitro-sound
```
After that, we make a small fix in the application configuration to request the necessary user permissions for accessing the microphone and saving the audio files. We open `android/app/src/main/AndroidManifest.xml` and add the following just above the `<application>` tag:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```
Now let's demonstrate how the microphone and headphones work by building an interactive app where a user can record their voice, store the audio file, and play it back.
```tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Platform, PermissionsAndroid, Alert, FlatList, } from 'react-native';
import Sound from 'react-native-nitro-sound';


interface RecordingEntry {
  id: string;
  path: string;
  name: string;
  timestamp: string;
}

const NitroAudioApp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordings, setRecordings] = useState<RecordingEntry[]>([]);
  const [currentPlayingPath, setCurrentPlayingPath] = useState<string | null>(null);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
        return (
          grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const onStartRecord = async () => {
    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Microphone access is required.');
      return;
    }

    setIsLoading(true);
    try {
      const path = await Sound.startRecorder();
      Sound.addRecordBackListener((e) => {
        setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
      });
      setIsRecording(true);
    } catch (error) {
      console.error('Start Record Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onStopRecord = async () => {
    setIsLoading(true);
    try {
      const path = await Sound.stopRecorder();
      Sound.removeRecordBackListener();
      setIsRecording(false);
      const newRecording: RecordingEntry = {
        id: Date.now().toString(),
        path: path,
        name: path.split('/').pop() || 'New Recording',
        timestamp: new Date().toLocaleTimeString(),
      };
      setRecordings((prev) => [newRecording, ...prev]);
      setRecordTime('00:00:00');
    } catch (error) {
      console.error('Stop Record Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onStartPlay = async (targetPath: string) => {
    setIsLoading(true);
    setCurrentPlayingPath(targetPath);
    try {
      await Sound.startPlayer(targetPath);
      Sound.addPlayBackListener((e) => {
        setPlayTime(Sound.mmssss(Math.floor(e.currentPosition)));
        setDuration(Sound.mmssss(Math.floor(e.duration)));
      });
      Sound.addPlaybackEndListener(() => {
        setIsPlaying(false);
        setCurrentPlayingPath(null);
        setPlayTime('00:00:00');
        Sound.removePlayBackListener();
      });
      setIsPlaying(true);
    } catch (error) {
      console.error('Playback Error:', error);
      setCurrentPlayingPath(null);
    } finally {
      setIsLoading(false);
    }
  };

  const onStopPlay = async () => {
    await Sound.stopPlayer();
    Sound.removePlayBackListener();
    Sound.removePlaybackEndListener();
    setIsPlaying(false);
    setCurrentPlayingPath(null);
  };

  const renderRecordingItem = ({ item }: { item: RecordingEntry }) => {
    const isThisItemPlaying = isPlaying && currentPlayingPath === item.path;
    return (
      <View style={styles.listItem}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemMeta}>{item.timestamp}</Text>
        </View>
        <TouchableOpacity
          style={[styles.itemButton, isThisItemPlaying ? styles.stopBtnSmall : styles.playBtnSmall]}
          onPress={() => isThisItemPlaying ? onStopPlay() : onStartPlay(item.path)}
        >
          <Text style={styles.itemButtonText}>{isThisItemPlaying ? 'Stop' : 'Play'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nitro Sound Lab</Text>
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>{isRecording ? 'Recording...' : 'Status'}</Text>
        <Text style={styles.timerText}>
          {isRecording ? recordTime : isPlaying ? `${playTime} / ${duration}` : '00:00:00'}
        </Text>
      </View>

      <View style={styles.controls}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6200EE" />
        ) : (
          <TouchableOpacity
            style={[styles.button, isRecording ? styles.stopBtn : styles.recordBtn]}
            onPress={isRecording ? onStopRecord : onStartRecord}
            disabled={isPlaying} // Prevent recording while playing back
          >
            <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.historyHeader}>Your Recordings</Text>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={renderRecordingItem}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No recordings yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: 60 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#222', marginBottom: 20 },
  timerContainer: { alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, padding: 20, borderRadius: 15, elevation: 2 },
  timerLabel: { fontSize: 12, color: '#6200EE', fontWeight: 'bold', textTransform: 'uppercase' },
  timerText: { fontSize: 36, fontWeight: '300', color: '#333' },
  controls: { padding: 30, alignItems: 'center' },
  button: { paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, width: '100%', alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  recordBtn: { backgroundColor: '#FF5252' },
  stopBtn: { backgroundColor: '#333' },
  historyHeader: { fontSize: 18, fontWeight: 'bold', marginLeft: 25, marginBottom: 10, color: '#444' },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  listItem: {  flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#EEE' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  itemMeta: { fontSize: 11, color: '#999', marginTop: 2 },
  itemButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  playBtnSmall: { backgroundColor: '#6200EE' },
  stopBtnSmall: { backgroundColor: '#333' },
  itemButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 14 }
});

export default NitroAudioApp;
```
First thing we did is creating states to manage the application's data and UI behavior.
- **isLoading** indicates when an audio action (recording or playing) is processing.
- **isRecording** tracks whether the app is currently recording audio.
- **isPlaying** tracks whether an audio file is currently playing.
- **recordings** stores a list of saved recordings (path, name, timestamp).
- **currentPlayingPath** keeps track of which recording is currently being played.
- **recordTime** shows the current recording time.
- **playTime** shows the current playback time.
- **duration** shows the total duration of the audio file.


Then we created the core functions that manage our application activity, and functionality

The first function we created is `checkPermissions` it checks if the user has granted permission to use the **microphone and storage**. On Android, we request permissions using `PermissionsAndroid.requestMultiple()`. If the permission is granted, the function returns `true`; otherwise it returns `false`.

The next function  is **`onStartRecord`** which calls `checkPermissions()` to ensure microphone access is allowed, If permission is denied, an alert message is displayed, else  `Sound.startRecorder()` is called to begin recording. then we attach a listener using `Sound.addRecordBackListener()` which continuously updates the recording time, the timer value is converted to a readable format using `Sound.mmssss()`.  Finally, the state `isRecording` becomes `true`, which updates the UI to indicate that recording is active.

After that we created `onStopRecord` function which recording and saves the audio file. we used  `Sound.stopRecorder()` to stop the recording and returns the file path where the audio was saved.
then we removed recording listener using `Sound.removeRecordBackListener()`, and created a new recording object is created containing:
- an `id`
- the file `path`
- the `name` extracted from the path
- a `timestamp`

This recording object is then added to the `recordings` state array, this allows the app to maintain a history of all recorded audio files that can later be played from the list.


To play the selected  record we created  `onStartPlay` function. The function receives the path of the selected recording, then play it with  `Sound.startPlayer(targetPath)` and update the current  play time using `Sound.addPlayBackListener()` finally we used  `Sound.addPlaybackEndListener()` to detect when the audio finishes playing. When this happen, the function resets the playing states and removes the playback listener.

The last  function is `onStopPlay` function, it  stops the audio if the user presses the stop button by calling  `Sound.stopPlayer()` to stop playback, it also  removes playback listeners, and updates the states `isPlaying` and `currentPlayingPath`.
### The Camera
The camera is an optical sensor that captures light and converts it into digital images or video. It allows applications to perceive the physical world visually and record that visual data directly into device storage.

To work with the camera for capturing both photos and videos, we commonly use the library `react-native-image-picker` to access the native camera, alongside `react-native-video` to handle video playback.

To work with these libraries, we need first to install them using
```
npm install react-native-image-picker react-native-video
```
After that, we need to request the required permissions for the camera. We open `android/app/src/main/AndroidManifest.xml` and add the following just above the `<application>` tag:
```
<uses-permission android:name="android.permission.CAMERA" />
```
Now let's demonstrate how the Camera works by building an interactive app that opens the device camera, lets the user take a picture or record a video, stores the media, and renders it on the screen.
```tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ScrollView, Platform, PermissionsAndroid, } from 'react-native';
import { launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import Video from 'react-native-video';

const MediaCaptureApp = () => {
  const [media, setMedia] = useState<{ uri: string; type: 'photo' | 'video' } | null>(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera access to take pictures.",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };
  
  const captureImage = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;
    launchCamera({ mediaType: 'photo', quality: 0.8 }, (response: ImagePickerResponse) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setMedia({ uri: response.assets[0].uri!, type: 'photo' });
      }
    });
  };

  const captureVideo = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;
    launchCamera({ mediaType: 'video', videoQuality: 'high', durationLimit: 30 }, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        setMedia({ uri: response.assets[0].uri!, type: 'video' });
      }
    });
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Media Studio</Text>
      <View style={styles.previewContainer}>
        {!media ? (
          <Text style={styles.placeholder}>No media captured</Text>
        ) : media.type === 'photo' ? (
          <Image source={{ uri: media.uri }} style={styles.preview} resizeMode="contain" />
        ) : (
          <Video
            source={{ uri: media.uri }}
            style={styles.preview}
            controls={true}
            resizeMode="contain"
            repeat={true}
          />
        )}
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={captureImage}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.videoButton]} onPress={captureVideo}>
          <Text style={styles.buttonText}>Record Video</Text>
        </TouchableOpacity>
      </View>
      {media && (
        <TouchableOpacity style={styles.clearButton} onPress={() => setMedia(null)}>
          <Text style={styles.clearText}>Clear Media</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#121212', alignItems: 'center', paddingVertical: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 30 },
  previewContainer: { width: '90%', height: 400, backgroundColor: '#1E1E1E', borderRadius: 20, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#333', },
  placeholder: { color: '#666', fontSize: 16 },
  preview: { width: '100%', height: '100%' },
  buttonRow: { flexDirection: 'row', gap: 15, marginTop: 30 },
  button: { backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 12,},
  videoButton: { backgroundColor: '#FF3B30' },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  clearButton: { marginTop: 20 },
  clearText: { color: '#AAA', textDecorationLine: 'underline' },
});

export default MediaCaptureApp;
```

The app have one state,**media** which It stores an object containing the `uri` (the local path to the file) and the `type` ('photo' or 'video'). This state allows the UI to dynamically show either a placeholder, an image preview, or a video player depending on what the user captured.

We also divided our app logic into three core functions: 

The first function we created is **`requestCameraPermission`**, it  ask the user for `CAMERA` access, and returns a boolean (`true` or `false`), which the subsequent capture functions use to decide if they should proceed or stop to avoid an application crash.

The next function is **`captureImage`**. Once it confirms permissions are granted via `requestCameraPermission()`, it calls `launchCamera()` from the `react-native-image-picker` library. We pass a configuration object specifying the `mediaType` as `'photo'`. When the user snaps a picture and confirms it, the function receives a response containing the local file path. We then update the `media` state with this URI and set the type to `'photo'`, which instantly triggers the UI to show the captured image.

After that, we created the **`captureVideo`** function. Similar to the image capture, this function utilizes `launchCamera()`, but we change the configuration to `mediaType: 'video'`. We also include specific constraints like `videoQuality: 'high'` and a `durationLimit` of 30 seconds to ensure the resulting file is high quality but doesn't consume too much device storage. Once the recording is finished, the function saves the video path to the `media` state with the type `'video'`.

Finally in the main UI, we implemented a check on the `media` state. If `media.type` is `'photo'`, the app renders the standard React Native `<Image>` component. However, if the type is `'video'`, the app instead renders the `<Video>` component from `react-native-video`. This component manages the complex task of loading the video buffer, providing playback controls, and looping the footage so the user can review their recording immediately.

### Storing Media
The media and audio files we capture using the device sensors are stored in the cache, which is temporary memory that mobile apps use to store quickly accessible data and return a URI to the file location.

The problem is that the cache is temporary storage, which means we can lose the data when the cache gets cleaned. In addition, the URI is stored in the component state, so if the cached file is deleted, the URI will point to a non-existing file.

To fix this issue, we can use persistent storage such as ``AsyncStorage`` to store the URI of our recorded audio or video for reference. We can also use ``react-native-fs`` to move the file from the cache to permanent storage (e.g., the app’s document directory).

Below is an example function that moves the file and updates the URI in the state:
```tsx
async function moveFile() {
  if (media) { 
    const newPath = RNFS.DocumentDirectoryPath + "/" + media.uri.split('/').pop();

    await RNFS.moveFile(media.uri, newPath);

    console.log(
      "File moved from",
      media.uri,
      `Media file moved to: ${newPath}`
    );

    setMedia({ uri: newPath, type: media.type });
  }
}
```