const BASE_URL = "http://localhost:5000/api";

const parseJson = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Something went wrong");
  }

  return data;
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return parseJson(res);
};

export const signupUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return parseJson(res);
};

export const createProject = async (data, token) => {
  const res = await fetch(`${BASE_URL}/project/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(data)
  });

  return parseJson(res);
};

export const getMembers = async (token) => {
  const res = await fetch(`${BASE_URL}/user/members`, {
    headers: {
      Authorization: token
    }
  });

  return parseJson(res);
};

export const getProjects = async (token) => {
  const res = await fetch(`${BASE_URL}/project/all`, {
    headers: {
      Authorization: token
    }
  });

  return parseJson(res);
};

export const getMyProjects = async (token) => {
  const res = await fetch(`${BASE_URL}/project/myprojects`, {
    headers: {
      Authorization: token
    }
  });

  return parseJson(res);
};

export const getTasksByProject = async (projectId, token) => {
  const res = await fetch(`${BASE_URL}/task/project/${projectId}`, {
    headers: {
      Authorization: token
    }
  });

  return parseJson(res);
};

export const getMyTasks = async (token) => {
  const res = await fetch(`${BASE_URL}/task/mytasks`, {
    headers: {
      Authorization: token
    }
  });

  return parseJson(res);
};

export const createTask = async (data, token) => {
  const res = await fetch(`${BASE_URL}/task/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(data)
  });

  return parseJson(res);
};

export const updateTaskStatus = async (data, token) => {
  const res = await fetch(`${BASE_URL}/task/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(data)
  });

  return parseJson(res);
};
