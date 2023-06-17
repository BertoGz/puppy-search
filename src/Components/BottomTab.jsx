import { Dimensions, Pressable, SafeAreaView, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FACEBOOK_BLUE, styles } from "../Styles";
const { height: screenHeight } = Dimensions.get("window") || {};

export default BottomTab = ({ currentRoute, setCurrentRoute }) => {
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
    <SafeAreaView
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        backgroundColor: "white",
      }}
      
    >
      <TouchableOpacity
        style={{ ...styles.buttomTab, backgroundColor: getBgColor(0) }}
        onPress={() => setCurrentRoute(0)}
      >
        <Text
          style={{ textAlign: "center", color: getTextColor(0), fontSize: 20 }}
        >
          Find pups
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ ...styles.buttomTab, backgroundColor: getBgColor(1) }}
        onPress={() => setCurrentRoute(1)}
      >
        <Text
          style={{ textAlign: "center", color: getTextColor(1), fontSize: 20 }}
        >
          Favorite pups
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
