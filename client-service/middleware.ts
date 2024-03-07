import acceptLanguage from "accept-language";
import helmet from "helmet";
import { NextRequest, NextResponse } from "next/server";
import { IncomingMessage, ServerResponse } from "http";
import { fallbackLng, languages, cookieName } from "./app/i18n/settings";

acceptLanguage.languages(languages);

export const config = {
  // matcher: "/:lng*"
  matcher: [
    "/((?!api|_next/static|static|_next/image|assets|favicon.ico|sw.js).*)",
  ],
};

const makeHelmetAdapter = (response: NextResponse) => {
  const req: Partial<IncomingMessage> = {};

  const res: Partial<ServerResponse<IncomingMessage>> = {
    setHeader(name: string, value: string | number | readonly string[]) {
      if (Array.isArray(value)) {
        response.headers.delete(name);
        value.forEach((v) => response.headers.append(name, v));
      } else {
        response.headers.set(name, value.toString());
      }

      return this as ServerResponse<IncomingMessage>;
    },
    removeHeader(name: string) {
      response.headers.delete(name);

      return this as ServerResponse<IncomingMessage>;
    },
  };

  return [
    req as IncomingMessage,
    res as ServerResponse<IncomingMessage>,
    () => {},
  ] as const;
};

export const getContentSecurityPolicy = (nonce?: string): string => {
  let script_src = "'self'";
  let script_src_elem = "'self'";

  if (process.env.NODE_ENV === "development") {
    script_src += " 'unsafe-inline' 'unsafe-eval'";
    script_src_elem += " 'unsafe-inline'";
  } else if (typeof nonce === "string" && nonce.length > 40) {
    script_src += ` 'nonce-${nonce}'`;
    script_src_elem += ` 'nonce-${nonce}'`;
  }

  const connect_src =
    process.env.NODE_ENV !== "development"
      ? "'self' ws:"
      : "'self' ws://localhost:*";

  return (
    "default-src 'self'; " +
    `script-src https://telegram.org https://api-maps.yandex.ru https://suggest-maps.yandex.ru http://*.maps.yandex.net https://yandex.ru https://yastatic.net ${script_src}; ` +
    `script-src-elem https://telegram.org https://api-maps.yandex.ru https://suggest-maps.yandex.ru http://*.maps.yandex.net https://yandex.ru https://yastatic.net ${script_src_elem};` +
    `style-src 'self' https: 'unsafe-inline'; ` +
    "base-uri 'self'; " +
    "child-src https://api-maps.yandex.ru 'self'; " +
    `connect-src https://jsonplaceholder.typicode.com https://api-maps.yandex.ru https://suggest-maps.yandex.ru https://*.maps.yandex.net https://yandex.ru https://*.taxi.yandex.net ${connect_src}; ` +
    "img-src 'self' blob: data: https://*.maps.yandex.net https://api-maps.yandex.ru https://yandex.ru;" +
    "font-src 'self' https: data:; " +
    "form-action 'self'; " +
    "frame-ancestors 'self'; " +
    "frame-src https://api-maps.yandex.ru 'self'; " +
    "manifest-src 'self'; " +
    "media-src 'self'; " +
    "object-src 'none'; " +
    // "prefetch-src 'self'; " +
    "script-src-attr 'none';" +
    "worker-src 'self' blob:; " +
    "upgrade-insecure-requests"
  );
};

const policies = [
  helmet.crossOriginEmbedderPolicy({
    policy: "credentialless",
  }),
  helmet.crossOriginOpenerPolicy(),
  helmet.crossOriginResourcePolicy(),
  helmet.dnsPrefetchControl(),
  // helmet.expectCt(),
  helmet.frameguard(),
  helmet.hidePoweredBy(),
  helmet.hsts(),
  helmet.ieNoOpen(),
  helmet.noSniff(),
  helmet.originAgentCluster(),
  helmet.permittedCrossDomainPolicies(),
  helmet.referrerPolicy(),
  helmet.xssFilter(),
];

export async function middleware(request: NextRequest) {
  let lng;
  if (request.cookies.has(cookieName))
    lng = acceptLanguage.get(request.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(request.headers.get("Accept-Language"));
  if (!lng) lng = fallbackLng;

  if (
    !languages.some((loc) => request.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !request.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${request.nextUrl.pathname}`, request.url),
    );
  }

  const referrer = request.headers.get("referrer");
  if (referrer) {
    const refererUrl = new URL(referrer);
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`),
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = getContentSecurityPolicy(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("Content-Security-Policy", cspHeader);

  const helmetAdapter = makeHelmetAdapter(response);
  policies.forEach((policy) => policy(...helmetAdapter));

  return response;
}
