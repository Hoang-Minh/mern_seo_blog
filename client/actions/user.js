import queryString from "query-string";
import { API } from "../config";

export const userPublicProfile = (username) => {
  return fetch(`${API}/api/user/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};
