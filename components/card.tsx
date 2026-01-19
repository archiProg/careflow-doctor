import { FontAwesome5 } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { ReactNode } from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface CardAction {
  label: string;
  onPress: () => void;
  icon?: string;
  disabled?: boolean;
}

interface CardProps {
  // Styling
  className?: string;
  style?: ViewStyle;

  // Content
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  badge?: string;
  badgeColor?: string;
  children?: ReactNode;

  // Header options
  urldetail?: Href;
  detailLabel?: string;
  showDetailButton?: boolean;

  // Subtitle options
  showSubtitleIcon?: boolean;
  subtitleIcon?: string;

  // Actions
  actions?: CardAction[];
  actionLayout?: "horizontal" | "vertical" | "grid";

  // Size
  size?: "sm" | "md" | "lg";
  minHeight?: number;
}

const Card: React.FC<CardProps> = ({
  className = "",
  title,
  subtitle,
  description,
  icon,
  badge,
  badgeColor = "bg-blue-500",
  children,
  urldetail,
  detailLabel = "Detail",
  showDetailButton = true,
  showSubtitleIcon = true,
  subtitleIcon = "clock",
  actions,
  actionLayout = "horizontal",
  size = "md",
}) => {
  const router = useRouter();

  const getActionIcon = (action: CardAction) => {
    if (action.icon) return action.icon;

    const label = action.label.toLowerCase();
    if (label === "pause") return "pause";
    if (label === "resume" || label === "start") return "play";
    if (label === "end" || label === "stop") return "stop";
    if (label === "delete") return "trash";
    if (label === "edit") return "edit";
    if (label === "save") return "save";
    if (label === "cancel") return "times";
    return null;
  };

  return (
    <View className={`${className} rounded-2xl shadow-lg overflow-hidden`}>
      {/* Header Section */}
      <View className={`p-4`}>
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 pr-4 flex-row items-center">
            {/* Icon */}
            {icon && (
              <View className="mr-3">
                <FontAwesome5
                  name={icon}
                  size={size === "sm" ? 18 : size === "lg" ? 28 : 24}
                  color="white"
                />
              </View>
            )}

            {/* Title */}
            <View className="flex-1">
              <Text
                className={`text-white font-bold leading-tight ${size === "sm"
                    ? "text-lg"
                    : size === "lg"
                      ? "text-3xl"
                      : "text-2xl"
                  }`}
              >
                {title}
              </Text>

              {/* Badge */}
              {badge && (
                <View
                  className={`${badgeColor} px-2 py-1 rounded-full self-start mt-2`}
                >
                  <Text className="text-white text-xs font-semibold">
                    {badge}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Detail Button */}
          {urldetail && showDetailButton && (
            <TouchableOpacity
              onPress={() => router.push(urldetail)}
              className="bg-white/20 px-4 py-2 rounded-full flex-row items-center active:scale-95"
              activeOpacity={0.8}
            >
              <Text className="text-white text-sm font-semibold mr-1">
                {detailLabel}
              </Text>
              <FontAwesome5 name="arrow-right" size={12} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Subtitle with Icon */}
        {subtitle && (
          <View className="flex-row items-center mt-3 bg-white/10 rounded-xl p-3">
            {showSubtitleIcon && (
              <FontAwesome5
                name={subtitleIcon}
                size={14}
                color="rgba(255,255,255,0.8)"
                style={{ marginRight: 8 }}
              />
            )}
            <Text className="text-white/90 text-sm font-medium flex-1">
              {subtitle}
            </Text>
          </View>
        )}

        {/* Description */}
        {description && (
          <Text className="text-white/70 text-sm mt-3 leading-5">
            {description}
          </Text>
        )}

        {/* Custom Children */}
        {children && <View className="mt-3">{children}</View>}
      </View>

      {/* Actions Section */}
      {actions && actions.length > 0 && (
        <View className="px-6 pb-6 pt-2">
          <View
            className={`
              ${actionLayout === "vertical" ? "flex-col gap-2" : ""}
              ${actionLayout === "grid" ? "flex-row flex-wrap gap-2" : ""}
              ${actionLayout === "horizontal" ? `flex-row gap-3 ${actions.length === 1 ? "justify-end" : "justify-between"}` : ""}
            `}
          >
            {actions.map((action, index) => {
              const actionIcon = getActionIcon(action);

              return (
                <TouchableOpacity
                  key={index}
                  onPress={action.onPress}
                  disabled={action.disabled}
                  className={`
                    ${actionLayout === "horizontal" && actions.length === 1 ? "px-8" : ""}
                    ${actionLayout === "horizontal" && actions.length > 1 ? "flex-1" : ""}
                    ${actionLayout === "vertical" ? "w-full" : ""}
                    ${actionLayout === "grid" ? "flex-1 min-w-[45%]" : ""}
                    bg-white
                    rounded-xl items-center justify-center py-3.5 shadow-md 
                    ${action.disabled ? "opacity-50" : "active:scale-95"}
                  `}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center">
                    {actionIcon && (
                      <FontAwesome5
                        name={actionIcon}
                        size={14}
                        color="#4b5563"
                        style={{ marginRight: 6 }}
                      />
                    )}

                    <Text className={`font-bold text-base text-gray-600`}>
                      {action.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default Card;
