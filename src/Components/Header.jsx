import { Image, SafeAreaView, View } from "react-native";
import { FACEBOOK_BLUE, styles } from "../Styles";
import logo from "../logo2.png";
export default Header = () => {
  return (
    <SafeAreaView style={{ backgroundColor: FACEBOOK_BLUE }}>
      <Image
        style={{
          height: 100,
          alignSelf: "center",
          aspectRatio: "1/.38",
        }}
        source={logo}
      />
    </SafeAreaView>
  );
};
