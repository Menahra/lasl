const API_PATH_PREFIX = "/api";
const API_VERSIONS = {
  1: "v1",
};

export const getApiVersionPathPrefix = (version: keyof typeof API_VERSIONS) => {
  return `${API_PATH_PREFIX}/${API_VERSIONS[version]}`;
};
