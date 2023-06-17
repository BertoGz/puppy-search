export async function requestGetDog() {
  const picResponse = await fetch("https://dog.ceo/api/breeds/image/random");
  const picJson = await picResponse.json();

  const nameResponse = await fetch(
    "https://random-data-api.com/api/v2/users?size=1&response_type=json"
  );
  const nameJson = await nameResponse.json();
  // /breeds\/redbone\
  const { status, message } = picJson || {};

  const { first_name } = nameJson || {};

  if (!status || !first_name) {
    return Promise.reject("error with endpoint");
  }
  return Promise.resolve({
    pic: message,
    name: first_name,
    id: `${first_name + message}`,
  });
}
