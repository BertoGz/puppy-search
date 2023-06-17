import AsyncStorage from "@react-native-async-storage/async-storage";
export const MAX_SEARCH_TODAY = 30;
export async function storeData(key, data) {
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
export async function getData(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return Promise.resolve(JSON.parse(value));
    }
  } catch (error) {
    Promise.reject("error");
    // Error retrieving data
  }
}
