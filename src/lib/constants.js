// api
export const DEFAULT_HEADERS = {
  "api-key": "2@w6g!!5",
};

export const ZTFR_DEFAULT_HEADERS = {
  "api-key": "$5hGM&89sL#",
};

// lamda API's
export const LAMDA_API_BASE =
  "https://backend-zimo-ws-213279879410.europe-west1.run.app/";

export const LAMDA_API_BASE_4 =
  "https://backend-zimo-ws-213279879410.europe-west1.run.app/";

export const LAMDA_API_BASE_2 =
  "https://shjyrco6wbm2ny47y2ee5bk2ee0uheil.lambda-url.eu-west-2.on.aws/";

export const LAMDA_API_BASE_3 =
  "https://cctajdr4omtq7tqa6zhxhbn4hm0dlssz.lambda-url.eu-west-2.on.aws/";

export const tandp = {
  terms: 1,
  privacy: 2,
  cookies: 3,
  eula: 4,
};


// Database search API - First check if record exists in our DB
// Provide the BASE endpoint (no query). We'll append `?original_url=<encoded>`
// This API will search for existing records in the database first
// If record found, it will return that metadata; otherwise, proceed with normal flow
export const CUSTOM_DESC_API =
  "https://backend-zimo-ws-213279879410.europe-west1.run.app/api/search-original-url";

