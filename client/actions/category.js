import { API } from "../config";
import { handleResponse } from "./auth";

export const create = (category, token) => {
  return fetch(`${API}/api/category`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((error) => console.log(error));
};

export const getCategories = (signal) => {
  return fetch(`${API}/api/categories`, {
    method: "GET",
    signal,
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};

export const getCategory = (slug) => {
  return fetch(`${API}/api/category/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};

export const removeCategory = (slug, token) => {
  return fetch(`${API}/api/category/${slug}`, {
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
