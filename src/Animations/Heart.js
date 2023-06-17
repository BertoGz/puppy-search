import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import State from "../State";

export default Heart = ({ onAnimationEnd }) => {
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(fade, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      onAnimationEnd();
    });
  }, [fade]);
  return (
    <Animated.View // Special animatable View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 99,
        opacity: fade, // Bind opacity to animated value
      }}
      pointerEvents={"none"}
    >
      <Ionicons name="heart" size={State.rootView.width} color="white" />
    </Animated.View>
  );
};
