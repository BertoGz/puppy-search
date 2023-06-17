import { StyleSheet } from "react-native";
export const FACEBOOK_BLUE = "rgb(66,103,178)";
export const styles = StyleSheet.create({
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
    height: 60,
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
});
