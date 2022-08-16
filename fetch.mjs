import axios from "axios";
import Papa from "papaparse";

function getFarenheitFromCelcius(c) {
  return c * (9 / 5) + 32;
}

async function fetch() {
  // I grabbed the url and the authorization token from chrome dev tools
  // when accessing the graph on cloud.corebodytemp.com
  const response = await axios.post(
    "https://europe-west1-core-b09b6.cloudfunctions.net/getDataTimeseries",
    {
      data: {
        device_id: "XX:XX:XX:XX:XX:XX", //EDIT ME: replace with your CORE sensor's bluetooth ID, as used to register on the cloud
        start: "2022-08-05T00:00:00.000Z",
        end: "2030-08-20T00:00:00.000Z",
      },
    },
    {
      headers: {
        authorization:
          "Bearer eyJGcNihbiOiJSUzI1MWIsImtpZCI6ImFkIxOWYwZjU4ZTJjOWE5Njc3M2M5MmNmODA0NDEwMTc5NzEzMjMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVCBTIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2NvcmUtYjA5YjYiLCJhdWQiOiJjb3JlLWIwOWI2IiwiYXV0aF90aW1lIjoxNjYwNjkwMTY4LCJ1c2VyX2lkIjoiOVNZVVdxcHowQWZXVXI0N2RBenhKZHJNcno0MiIsInN1YiI6IjlTWVVXcXB6MEFmV1VyNDdkQXp4SmRyTXJ6NDIiLCJpYXQiOjE2NjA2OTAxNjgsImV4cCI6MTY2MDY5Mzc2OCwiZW1haWwiOiJ0ZWQuY29yZWJvZHl0ZW1wQHN1em1hbi5uZXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZWQuY29yZWJvZHl0ZW1wQHN1em1hbi5uZXQiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Rai2aYQsPpB3g294ddL7x_EHB1-xzjhXVRolEAJ2pc1yCAt_ZW0usSlODSZ8mBLMV2cwj6DNUEZWbg_5MrDkiTcg0FHxm3entqSugEGG3qSjtnxnowdjEhMkRnd5USidNIZor66G3qJg7yzFLsaOoR3iphmTchYZ9lRdBThvKzcmMYgNE8w6OtjvNAX4ZaB6yH0dNUGQo7g0tGBUL91xQpr3M3bsNfTrQBEQn7VKJD9jQ2ZhRCVIukogZwcTGFMGMU-iCSG4wnZ4NbDgNuB2OS4e44JLzOYRM_BHSrk-dJBTnzryxi_PiHtelO4DBVVjyPmA6L_9LNVyKPhmxNFAHQ",
      },
    }
  );

  return response.data;
}

(async () => {
  const result = await fetch();

  const csv = Papa.unparse(
    result.result.device_data
      .filter(({ core_temp }) => core_temp != 0)
      .map(({ core_temp, time_utc }) => [
        new Date(time_utc).getTime(),
        getFarenheitFromCelcius(core_temp),
      ])
  );

  console.log(csv);
})();
