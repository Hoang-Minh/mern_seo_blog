import { API } from "../config";

export const create = (blog, token) => {
  return fetch(`${API}/api/blog`, {
    method: "POST",
    headers: {
      Accept: "application/json",

      Authorization: `Bearer ${token}`,
    },
    body: blog,
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};

export const listBlogsWithCategoriesAndTags = (token) => {
  return fetch(`${API}/api/blogs-categories-tags`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};
