import { Image, Text, View } from "react-native";
import { styles } from "../Styles";
import state from "../State";

export default PuppyCard = ({ dogData, small = false }) => {
  console.log("rootView", state.rootView);
  if (!dogData?.pic){
    return <></>
  }
  return (
    <View
      style={{
        marginTop: 10,
        width: small && state.rootView?.width ? state.rootView.width / 3 : undefined,
      }}
    >
      <Image style={{ ...styles.img }} source={{ uri: dogData.pic } || ""} />
      <Text style={styles.dogNameLabel}>{dogData.name}</Text>
    </View>
  );
};
