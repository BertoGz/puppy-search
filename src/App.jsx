import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import state from "./State";
import { getData, storeData } from "./Helpers";
import Search from "./Routes/Search";
import Favorites from "./Routes/Favorites";
import BottomTab from "./Components/BottomTab";
import { styles } from "./Styles";
import Header from "./Components/Header";
import moment from "moment";
const { height: screenHeight } = Dimensions.get("window") || {};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(0);
  const [favDogs, setFavDogs] = useState([]);
  const [doneLoading, setDoneLoading] = useState(false);
  useEffect(() => {
    async function loadUserData() {
      await getData("favs").then((data) => {
        if (data?.length) {
          setFavDogs(data);
        }
      });
      await getData("totalSearchedToday").then((data) => {
        state.totalSearchedToday = data || 0;
      });
      await getData("lastSearch").then((data) => {
        state.lastSearch = data;
        const hours = moment.duration(moment().diff(moment(data))).as("hours");
        if (hours >= 24) {
          state.totalSearchedToday = 0;
        }
      });
      await getData("lastDog").then((data) => {
        if (data) {
          state.dogData = data;
        }
      });

      setDoneLoading(true);
    }
    loadUserData();
  }, []);
  function addToFavs(dog) {
    if (
      favDogs.find((d) => {
        return d.id === dog.id;
      })
    ) {
    } else {
      const updatedDogs = [...favDogs, dog];
      setFavDogs(updatedDogs);
      storeData("favs", updatedDogs);
    }
  }
  if (!doneLoading) {
    return <></>;
  }
  const Route1 = <Search {...{ addToFavs }} />;
  const Route2 = <Favorites {...{ favDogs }} />;
  let RouteToRender = <></>;

  switch (currentRoute) {
    case 0:
      RouteToRender = Route1;
      break;
    case 1:
      RouteToRender = Route2;
      break;
  }
  // depending on route, when the route is changed,
  // save the cache one and put the new one
  return (
    <GestureHandlerRootView style={{ display: "flex", height: screenHeight }}>
      <StatusBar style="auto" />
      <View
        style={{
          height: screenHeight,
          justifyContent: "space-between",
        }}
      >
        <Header />

        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
          }}
        >
          <View
            onLayout={(e) => {
              state.rootView = e.nativeEvent.layout;
            }}
          >
            <View style={{ ...styles.container }}>{RouteToRender}</View>
          </View>
        </View>
        <BottomTab {...{ currentRoute, setCurrentRoute }} />
      </View>
    </GestureHandlerRootView>
  );
}
