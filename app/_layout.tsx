
import "@/global.css";
import { store } from "@/stores/index";
import { Slot } from "expo-router";
import { Provider } from "react-redux";

export default function RootLayout() {

  return (
    <Provider store={store} >
      <Slot />
    </Provider>
  );
}
