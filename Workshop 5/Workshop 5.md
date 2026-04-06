

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