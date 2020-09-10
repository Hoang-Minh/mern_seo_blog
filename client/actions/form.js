import { API } from "../config";

export const emailContactForm = (data) => {
  let endpoint;

  if (data.authorEmail) {
    endpoint = `${API}/api/contact-blog-author`;
  } else {
    endpoint = `${API}/api/contact`;
  }

  return fetch(`${endpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};
