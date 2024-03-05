import { NextRequest, NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import helmet from "helmet";
import { fallbackLng, languages, cookieName } from "./app/i18n/settings";
import { IncomingMessage, ServerResponse } from "http";

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

const policies = [
  helmet.crossOriginEmbedderPolicy({
    policy: "credentialless",
  }),
  helmet.crossOriginOpenerPolicy(),
  helmet.crossOriginResourcePolicy(),
  helmet.dnsPrefetchControl(),
  // helmet.expectCt(),
  helmet.frameguard({ action: "sameorigin" }),
  helmet.hidePoweredBy(),
  helmet.hsts(),
  helmet.ieNoOpen(),
  helmet.noSniff(),
  helmet.originAgentCluster(),
  helmet.permittedCrossDomainPolicies(),
  helmet.referrerPolicy(),
  helmet.xssFilter(),
  (req: any, res: { setHeader: (arg0: string, arg1: string) => void }) => {
    res.setHeader("X-XSS-Protection", "1; mode=block");
  },
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

  const response = NextResponse.next();
  const helmetAdapter = makeHelmetAdapter(response);

  policies.forEach((policy) => policy(...helmetAdapter));

  return response;
}
