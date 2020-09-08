import { API } from "../config";
import { handleResponse } from "./auth";

export const create = (tag, token) => {
  return fetch(`${API}/api/tag`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tag),
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((error) => console.log(error));
};

export const getTags = (signal) => {
  return fetch(`${API}/api/tags`, {
    method: "GET",
    signal,
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};

export const getTag = (slug) => {
  return fetch(`${API}/api/tag/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};

export const removeTag = (slug, token) => {
  return fetch(`${API}/api/tag/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((error) => console.log(error));
};
