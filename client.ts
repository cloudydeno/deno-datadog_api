// some datadog apis have big IDs, let's stringify them before we lose precision
function fixupDatadogJson(json: string): string {
  return json.replace(/"(id|[^":]+_id)": *\d+/g, (field) => {
    const [k, v] = field.split(/: */);
    return `${k}:"${v}"`;
  });
}

export type ApiConfig = {
  apiKey?: string;
  appKey?: string;
  apiBase?: string;
};

export default class DatadogApiClient {
  headers: Record<string,string>;
  apiBase: string;

  constructor({
    apiKey,
    appKey,
    apiBase = "https://api.datadoghq.com",
  }: ApiConfig) {
    if (!apiKey) {
      throw new Error(
        `apiKey is required to communicate with Datadog`,
      );
    }
    if (!apiBase?.includes("://")) {
      throw new Error(
        `If you pass apiBase, it must be an absolute URL`,
      );
    }

    this.headers = {
      "dd-api-key": apiKey,
    };
    if (appKey) {
      this.headers["dd-application-key"] = appKey;
    }
    this.apiBase = apiBase;
  }

  async fetchJson(url: string, opts: {
    requestJson?: unknown;
  } = {}): Promise<unknown> {
    const resp = await fetch(this.apiBase + url, {
      headers: {
        "content-type": "application/json",
        "accept": "application/json",
        ...this.headers,
      },
      body: opts.requestJson ? JSON.stringify(opts.requestJson) : "",
    });

    const respBody = await resp.text();
    if (resp.status >= 200 && resp.status < 300) {
      return JSON.parse(fixupDatadogJson(respBody));
    }

    if (respBody.startsWith("{")) {
      const errorJson = JSON.parse(respBody);
      const parsedError = recognizeError(errorJson);
      if (parsedError) {
        throw new DatadogError(parsedError);
      }
      console.log("Datadog error response body:", respBody);
    }
    throw new Error(`Datadog returned HTTP status ${resp.status}`);
  }
}

export class DatadogError extends Error {
  data: ServerError;
  constructor(body: ServerError) {
    switch (body._type) {
      case "simple":
      case "rich":
        super(body.errors.join(" & "));
        break;
      case "html":
        super(body.code);
        break;
      default:
        super("BUG: no error type");
    }
    Error.captureStackTrace(this, new.target);

    this.name = "DatadogError";
    this.data = body;
  }
}

// Datadog can return a few different shapes of error
// Let's make an artificial descriminated union so Typescript is more helpful
// We'll then throw a consistent DatadogError wrapped around whichever is given.
export type ServerError = SimpleError | RichError | HtmlError;

function recognizeError(data: unknown): ServerError | null {
  if (isRichError(data)) {
    data._type = "rich";
    return data;
  } else if (isSimpleError(data)) {
    data._type = "simple";
    return data;
  } else if (isHtmlError(data)) {
    data._type = "html";
    return data;
  }
  return null;
}

export interface SimpleError {
  "_type": "simple";
  "errors": string[];
}
function isSimpleError(err: any): err is SimpleError {
  return err &&
    Array.isArray(err.errors) &&
    typeof err.errors[0] === "string";
}

export interface RichError {
  "_type": "rich";
  "errors": string[];
  "status": "error" | string;
  "code": 400 | 403 | number;
  "statuspage": string;
  "twitter": string;
  "email": string;
}
function isRichError(err: any): err is RichError {
  return err &&
    Array.isArray(err.errors) &&
    typeof err.errors[0] === "string" &&
    typeof err.status === "string" &&
    typeof err.code === "number" &&
    typeof err.statuspage === "string" &&
    typeof err.twitter === "string" &&
    typeof err.email === "string";
}

export interface HtmlError {
  "_type": "html";
  "code": string;
  "message": string;
  "title": string;
}
function isHtmlError(err: any): err is HtmlError {
  return err &&
    typeof err.code === "string" &&
    typeof err.message === "string" &&
    typeof err.title === "string";
}
