import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { useTranslation } from "react-i18next";

interface LoadingProps {
  message?: string;
  dotColor?: string;
}

const loadingMini: React.FC<LoadingProps> = ({
  message = "Loading",
  dotColor = "#33AAE1",
}) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -10,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            delay,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, [dot1, dot2, dot3]);

  return (
    <View className="flex-1 items-center justify-center py-8">
      <View className="flex-row items-center justify-center gap-x-2">
        <Animated.View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: dotColor,
            transform: [{ translateY: dot1 }],
          }}
        />
        <Animated.View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: dotColor,
            transform: [{ translateY: dot2 }],
          }}
        />
        <Animated.View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: dotColor,
            transform: [{ translateY: dot3 }],
          }}
        />
      </View>
        <Text className="text-gray-500 mt-6 text-center">
          {message}
        </Text>
    </View>
  );
};

export default loadingMini;