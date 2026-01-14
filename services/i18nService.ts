import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import "intl-pluralrules";
import { initReactI18next } from "react-i18next";
import en from "../assets/locales/en.json";
import th from "../assets/locales/th.json";
import Provider from "./providerService";

const LANGUAGE_KEY = "APP_LANGUAGE";
const DEFAULT_LANGUAGE = "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { ns1: en },
    th: { ns1: th },
  },
  lng: "en",
  fallbackLng: "th",
  defaultNS: "ns1",
  interpolation: { escapeValue: false },
});

export const changeLanguage = async (lng: string) => {
  await i18n.changeLanguage(lng);
  await AsyncStorage.setItem(LANGUAGE_KEY, lng);
  console.log(lng);
  Provider.Language = lng;
};


export const loadLanguage = async () => {
  const lng = await AsyncStorage.getItem(LANGUAGE_KEY);
  console.log(lng);

  if (lng) {
    await i18n.changeLanguage(lng);
    Provider.Language = lng;
  } else {
    await i18n.changeLanguage(DEFAULT_LANGUAGE);
    await AsyncStorage.setItem(LANGUAGE_KEY, DEFAULT_LANGUAGE);
    Provider.Language = DEFAULT_LANGUAGE;
  }
};

export default i18n;
