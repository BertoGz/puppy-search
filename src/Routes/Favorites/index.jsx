import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import state from "../../State";
import PuppyCard from "../../Components/PuppyCard";
import { FACEBOOK_BLUE } from "../../Styles";
const { height: screenHeight } = Dimensions.get("window") || {};

export default Favorites = ({ favDogs }) => {
  const [viewStyle, setViewStyle] = useState("regular");
  const scrollRef = useRef();
  const onScroll = ({ nativeEvent }) => {
    const position = nativeEvent.contentOffset;
    state.scrollPos.y = position.y;
  };
  function onSwitchViewStyle() {
    if (viewStyle === "small") {
      setViewStyle("regular");
    } else {
      setViewStyle("small");
    }
  }
  const Header = () => {
    return (
      <View
        style={{
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          style={{ alignSelf: "flex-end" }}
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
      style={{ flexGrow: 1 }}
      onLayout={() => {
        scrollRef.current.scrollToOffset({
          animated: false,
          offset: state.scrollPos.y,
        });
      }}
      contentContainerStyle={{ paddingBottom: 100 }}
      ref={scrollRef}
      onScroll={onScroll}
      data={favDogs}
      key={`${viewStyle === "small"},${favDogs.length}`}
      ListHeaderComponent={<Header />}
      ItemSeparatorComponent={
        <Text
          style={{
            color: 'lightgray',
            textAlign: "center",
            fontSize: 45,
            fontWeight: 100,
          }}
        >
          Favorite Puppy
        </Text>
      }
      stickyHeaderIndices={[0]}
      numColumns={viewStyle === "small" ? 3 : 0}
      renderItem={({ item }) => {
        return (
          <>
            <PuppyCard {...{ dogData: item, small: viewStyle === "small" }} />
          </>
        );
      }}
      keyExtractor={(item) => item.pic}
    />
  );
};
