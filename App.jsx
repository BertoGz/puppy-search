import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Dimensions,
  FlatList,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";

const { width: screenWidth, height: screenHeight } =
  Dimensions.get("window") || {};
async function requestGetDogs() {
  const picResponse = await fetch("https://dog.ceo/api/breeds/image/random");
  const picJson = await picResponse.json();

  const nameResponse = await fetch(
    "https://random-data-api.com/api/v2/users?size=1&response_type=json"
  );
  const nameJson = await nameResponse.json();

  const { status, message } = picJson || {};

  const { first_name } = nameJson || {};

  if (!status || !first_name) {
    return Promise.reject("error with endpoint");
  }
  return Promise.resolve({ pic: message, name: first_name });
}
let rootView = undefined;
async function storeData(key, data) {
  if (!key || !data) {
    console.log("req params not found");
    return Promise.reject("");
  }
  const parsedData = JSON.stringify(data);
  try {
    await AsyncStorage.setItem(key, parsedData);
    return Promise.resolve("1");
  } catch (error) {
    return Promise.reject(error);
    // Error saving data
  }
}
async function getData(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      console.log(value);
      return Promise.resolve(JSON.parse(value));
    }
  } catch (error) {
    Promise.reject("error");
    // Error retrieving data
  }
}
const BottomTab = ({ currentRoute, setCurrentRoute }) => {
  function getBgColor(num) {
    if (currentRoute === num) {
      return "white";
    }
    return "white";
  }
  function getTextColor(num) {
    if (currentRoute === num) {
      return FACEBOOK_BLUE;
    }
    return "black";
  }
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexGrow: 1,
      }}
    >
      <Pressable
        style={{ ...styles.buttomTab, backgroundColor: getBgColor(0) }}
        onPress={() => setCurrentRoute(0)}
      >
        <Text
          style={{ textAlign: "center", color: getTextColor(0), fontSize: 20 }}
        >
          Find pups
        </Text>
      </Pressable>
      <Pressable
        style={{ ...styles.buttomTab, backgroundColor: getBgColor(1) }}
        onPress={() => setCurrentRoute(1)}
      >
        <Text
          style={{ textAlign: "center", color: getTextColor(1), fontSize: 20 }}
        >
          Favorite pups
        </Text>
      </Pressable>
    </View>
  );
};

const state = {
  dogData: "",
};

const PuppyCard = ({ dogData, small = false }) => {
  console.log("rootView", rootView);
  return (
    <View
      style={{
        marginTop: 10,
        width:
          small && rootView?.width
            ? (rootView.width) / 3
            : undefined,
      }}
    >
      <Image style={{ ...styles.img }} source={{ uri: dogData.pic } || ""} />
      <Text style={styles.dogNameLabel}>{dogData.name}</Text>
    </View>
  );
};
const Heart = () => {
  return <></>;
};

const RouteGetDogs = ({ addToFavs }) => {
  const [dogData, setDogData] = useState(state.dogData);
  const doubleTapRef = useRef();
  useEffect(() => {
    if (!dogData) {
      requestGetDogs().then((data) => {
        setDogData(data);
        state.dogData = data;
      });
    }
  }, []);

  return (
    <View>
      <TapGestureHandler
        ref={doubleTapRef}
        numberOfTaps={2}
        onActivated={() => {
          addToFavs(dogData);
          Vibration.vibrate();
        }}
      >
        <View>
          <Heart />
          <PuppyCard {...{ dogData }} />
        </View>
      </TapGestureHandler>

      <View style={{ paddingTop: 10, gap: 10 }}>
        <Text style={styles.description}>
          double tap to add dog to your favorites!
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            requestGetDogs()
              .then((data) => {
                setDogData(data);
                state.dogData = data;
              })
              .catch((err) => {
                Alert.alert(
                  "Oops",
                  "something went wrong on our end, please try again."
                );
              });
          }}
        >
          <>
            <FontAwesome name="search" size={26} color="white" />
            <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
              Search new pup
            </Text>
          </>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const scrollPos = { y: 0 };
const RouteFavoriteDogs = ({ favDogs }) => {
  const [viewStyle, setViewStyle] = useState("column");
  const scrollRef = useRef();
  const onMomentumScrollEnd = ({ nativeEvent }) => {
    const position = nativeEvent.contentOffset;
    scrollPos.y = position.y;
  };
  function onSwitchViewStyle() {
    if (viewStyle === "column") {
      setViewStyle("grid");
    } else {
      setViewStyle("column");
    }
  }
  const Header = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          backgroundColor: "white",
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 25 }}>Favorite pups</Text>
        <TouchableOpacity
          onPress={() => {
            onSwitchViewStyle();
          }}
        >
          <Ionicons size={30} name="grid-outline" color={FACEBOOK_BLUE} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      onLayout={() => {
        scrollRef.current.scrollToOffset({
          animated: false,
          offset: scrollPos.y,
        });
      }}
      ref={scrollRef}
      onScroll={onMomentumScrollEnd}
      data={favDogs}
      key={favDogs}
      style={{ height: screenHeight * 0.7 }}
      ListHeaderComponent={<Header />}
      stickyHeaderIndices={[0]}
      numColumns={4}
      renderItem={({ item, index }) => {
        return (
          <>
            <PuppyCard {...{ dogData: item, small: true }} />
          </>
        );
      }}
      keyExtractor={(item) => item.pic}
    />
  );
};
export default function App() {
  const [currentRoute, setCurrentRoute] = useState(0);
  const [favDogs, setFavDogs] = useState([]);
  useEffect(() => {
    async function loadFavs() {
      getData("favs").then((data) => {
        if (data?.length) {
          setFavDogs(data);
        }
      });
    }
    loadFavs();
  }, []);
  function addToFavs(dog) {
    if (
      favDogs.find((d) => {
        return d.pic === dog.pic;
      })
    ) {
    } else {
      const updatedDogs = [...favDogs, dog];
      setFavDogs(updatedDogs);
      storeData("favs", updatedDogs);
    }

    // Alert.alert("Success", "added to favorites");
  }

  const Route1 = <RouteGetDogs {...{ addToFavs }} />;
  const Route2 = <RouteFavoriteDogs {...{ favDogs }} />;
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
    <GestureHandlerRootView style={{ height: screenHeight }}>
      <StatusBar style="auto" />
      <View style={{ paddingHorizontal: 20, paddingVertical: 40 }}>
        <View
          onLayout={(e) => {
            rootView = e.nativeEvent.layout;
          }}
        >
          <Text style={styles.header}>PuppySearch</Text>
          <View style={{ ...styles.container }}>{RouteToRender}</View>
        </View>
      </View>
      <BottomTab {...{ currentRoute, setCurrentRoute }} />
    </GestureHandlerRootView>
  );
}

const FACEBOOK_BLUE = "rgb(66,103,178)";
const styles = StyleSheet.create({
  dogNameLabel: {
    position: "absolute",
    color: "white",
    fontSize: 20,
    paddingHorizontal: 10,
    textAlign: "left",
    width: "100%",
    backgroundColor: "rgba(40,40,40,.5)",
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: FACEBOOK_BLUE,
    color: "white",
  },
  container: {
    display: "flex",
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  img: {
    alignSelf: "center",
    width: "100%",
    height: "auto",
    aspectRatio: "1/1",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
    alignSelf: "center",
    borderColor: "gray",
    backgroundColor: "rgb(120,160,200)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    borderRadius: 5,
    gap: 5,
  },
  description: {
    fontSize: 18,
    textAlign: "center",
  },
  buttomTab: {
    backgroundColor: "lightblue",
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 15,
  },
});
