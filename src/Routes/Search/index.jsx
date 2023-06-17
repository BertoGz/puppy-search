import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dimensions, TouchableOpacity, Vibration } from "react-native";
import { Alert, Text, View } from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";
import state from "../../State";
import { requestGetDog } from "../../Requests";
import Heart from "../../Animations/Heart";
import PuppyCard from "../../Components/PuppyCard";
import { styles } from "../../Styles";
import { MAX_SEARCH_TODAY, storeData } from "../../Helpers";

export default Search = ({ addToFavs }) => {
  const [dogData, setDogData] = useState(state.dogData);
  const [showHeart, setShowHeart] = useState(false);
  const [canSearch, setCanSearch] = useState(false);
  useEffect(() => {
    state.totalSearchedToday >= MAX_SEARCH_TODAY
      ? setCanSearch(false)
      : setCanSearch(true);
  }, []);
  const doubleTapRef = useRef();
  async function onGetNewPup(data) {
    setDogData(data);
    state.dogData = data;
    state.totalSearchedToday += 1;
    await storeData("totalSearchedToday", state.totalSearchedToday);
    await storeData("lastDog", state.dogData);
    await storeData("lastSearch", Date.now());
  }
  useEffect(() => {
    if (!dogData) {
      requestGetDog().then(async (data) => {
        onGetNewPup(data);
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
          setShowHeart(true);
        }}
      >
        <View style={{ display: "flex", flexGrow: 1 }}>
          {showHeart && (
            <Heart {...{ onAnimationEnd: () => setShowHeart(false) }} />
          )}
          <PuppyCard {...{ dogData }} />
        </View>
      </TapGestureHandler>

      {canSearch && (
        <View style={{ paddingTop: 10, gap: 10 }}>
          <Text style={styles.description}>
            double tap to add dog to your favorites!
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (state.totalSearchedToday >= MAX_SEARCH_TODAY) {
                setCanSearch(false);
                return;
              }
              requestGetDog()
                .then(async (data) => {
                  onGetNewPup(data);
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
              <Text
                style={{ fontSize: 30, fontWeight: "bold", color: "white" }}
              >
                Search new pup
              </Text>
            </>
          </TouchableOpacity>
        </View>
      )}
      {!canSearch && (
        <Text style={{ padding: 10, textAlign: "center" }}>
          No more pups for today!{"\n"} Have you checked out the Puppy Center?
        </Text>
      )}
    </View>
  );
};
