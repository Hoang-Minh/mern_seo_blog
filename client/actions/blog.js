import queryString from "query-string";
import { API } from "../config";
import { isAuth } from "./auth";

export const create = (blog, token) => {
  let endpoint;

  if (isAuth() && isAuth().role === 1) {
    endpoint = `${API}/api/blog`;
  } else if (isAuth() && isAuth().role === 0) {
    endpoint = `${API}/api/user/blog`;
  }

  return fetch(`${endpoint}`, {
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

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
  const data = {
    limit,
    skip,
  };
  return fetch(`${API}/api/blogs-categories-tags`, {
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

export const singleBlog = (slug) => {
  return fetch(`${API}/api/blog/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};

export const listRelated = (blog) => {
  return fetch(`${API}/api/blogs/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blog),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};

export const list = (username) => {
  const endpoint = username
    ? `${API}/api/${username}/blogs`
    : `${API}/api/blogs`;

  return fetch(`${endpoint}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};

export const remove = (slug, token) => {
  let endpoint;

  if (isAuth() && isAuth().role === 1) {
    endpoint = `${API}/api/blog/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    endpoint = `${API}/api/user/blog/${slug}`;
  }

  return fetch(`${endpoint}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};

export const update = (blog, token, slug) => {
  let endpoint;

  if (isAuth() && isAuth().role === 1) {
    endpoint = `${API}/api/blog/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    endpoint = `${API}/api/user/blog/${slug}`;
  }

  return fetch(`${endpoint}`, {
    method: "PUT",
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

export const listSearch = (params) => {
  console.log("search params", params);
  const query = queryString.stringify(params);
  console.log("query params", query);
  return fetch(`${API}/api/blogs/search?${query}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};
