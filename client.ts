// some datadog apis have big IDs, let's stringify them before we lose precision
function fixupDatadogJson(json: string): string {
  return json.replace(/"(id|[^":]+_id)": *\d+/g, (field) => {
    const [k, v] = field.split(/: */);
    return `${k}:"${v}"`;
  });
}

export type ApiConfig = {
  apiKey: string;
  appKey?: string;
  apiBase?: string;
};

export default class DatadogApiClient {
  headers: Headers;
  apiBase: string;

  constructor(opts: ApiConfig) {
    if (!opts.apiKey) throw new Error(
      `apiKey is required to communicate with Datadog`,
    );

    this.headers = new Headers({
      "content-type": "application/json",
      "accept": "application/json",
      "dd-api-key": opts.apiKey,
    });
    if (opts.appKey) {
      this.headers.set("dd-application-key", opts.appKey);
    }

    this.apiBase = opts.apiBase || "https://api.datadoghq.com";
    if (!this.apiBase.includes("://")) throw new Error(
      `If you pass apiBase, it must be an absolute URL`,
    );
  }

  async fetchJson(opts: {
    method?: 'GET' | 'POST';
    path: string;
    query?: URLSearchParams;
    body?: unknown;
  }): Promise<unknown> {
    let url = this.apiBase + opts.path;
    if (opts.query) {
      url += url.includes('?') ? '&' : '?';
      url += opts.query.toString();
    }

    const resp = await fetch(url, {
      headers: this.headers,
      method: opts.method ?? 'GET',
      body: opts.body ? JSON.stringify(opts.body) : "",
    });

    const respBody = await resp.text();
    if (resp.status >= 200 && resp.status < 300) {
      return JSON.parse(fixupDatadogJson(respBody));
    }

    // Be friendly if the user is likely misconfigured
    if (resp.status === 403 && respBody === '{"errors": ["Forbidden"]}') {
      if (!('dd-application-key' in this.headers)) {
        throw new DatadogError({
          _type: "simple", errors: [
            "Forbidden. Did you forget to set DATADOG_APP_KEY?"
          ]});
      }
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


//------------------
// Error Handling

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

/** Error often returned for validation errors and other endpoint-specific checks */
export interface SimpleError {
  "_type": "simple";
  "errors": string[];
}
function isSimpleError(err: any): err is SimpleError {
  return err &&
    Array.isArray(err.errors) &&
    typeof err.errors[0] === "string";
}

/** Error for general API problems such as missing auth */
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

/** Generic error from the overall web server */
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
