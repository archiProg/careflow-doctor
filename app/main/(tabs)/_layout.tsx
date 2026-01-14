import { FontAwesome } from "@expo/vector-icons";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";


import { useTranslation } from "react-i18next";
const TabLayout = () => {
  const { t } = useTranslation();


  return (
    <NativeTabs tintColor="#2563EB" backgroundColor="#FFFFFF">
      <NativeTabs.Trigger name="homeScreen">
        <Label>{t("home")}</Label>
        <Icon src={<VectorIcon family={FontAwesome} name="home" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="historyScreen">
        <Label>{t("history")}</Label>
        <Icon src={<VectorIcon family={FontAwesome} name="history" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settingScreen">
        <Label>{t("setting")}</Label>
        <Icon src={<VectorIcon family={FontAwesome} name="cog" />} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabLayout;
