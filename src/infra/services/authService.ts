import { OAuth2Client } from "google-auth-library";
import {
  createCookie,
  createCookieSessionStorage,
  redirect,
  type CookieOptions,
  type SessionIdStorageStrategy,
} from "react-router";

import { environmentVariables } from "~/main/config/environmentVariables";
import type { RouteDTO } from "~/main/types/route";
import type { User } from "~/main/types/user";

import { name } from "../../../package.json";
import { HttpAdapter } from "../adapters/httpAdapter";
import { RedirectServerAdapter } from "../adapters/redirectServerAdapter";

const COOKIE_OPTIONS: CookieOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60,
  secure: false,
};

const SESSION_OPTIONS: SessionIdStorageStrategy["cookie"] = {
  sameSite: "lax",
  path: "/",
  httpOnly: true,
  secrets: [environmentVariables.SESSION_SECRET],
  secure: process.env.NODE_ENV === "production",
};

class AuthService {
  private static authCallbackCookie = createCookie(
    "callback-to",
    COOKIE_OPTIONS,
  );

  private static authStorageCookie = createCookieSessionStorage({
    cookie: { ...SESSION_OPTIONS, name: `${name}-admin-auth` },
  });

  static oauthClient = new OAuth2Client({
    clientId: environmentVariables.GOOGLE_CLIENT_ID,
    clientSecret: environmentVariables.GOOGLE_CLIENT_SECRET,
    redirectUri: environmentVariables.GOOGLE_REDIRECT_URL,
  });

  static generateAuthUrl = (state: string) => {
    return this.oauthClient.generateAuthUrl({
      access_type: "online",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
      state,
    });
  };

  static async getTokenFromCode(code: string) {
    const { tokens } = await this.oauthClient.getToken(code);

    if (!tokens.id_token) {
      throw HttpAdapter.badRequest("Something went wrong. Please try again.");
    }

    const payload = await this.oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const idTokenBody = payload.getPayload();
    if (!idTokenBody) throw HttpAdapter.serverError("Invalid ID token payload");

    return idTokenBody;
  }

  static async getAuthCallback(route: RouteDTO): Promise<string | null> {
    return this.authCallbackCookie.parse(route.request.headers.get("cookie"));
  }

  static async setAuthCallback(to: string, refundTo: string) {
    const serializedTo = await this.authCallbackCookie.serialize(refundTo);

    return RedirectServerAdapter.to(to, {
      headers: { "Set-Cookie": serializedTo },
    });
  }

  static async getAuthStorage(route: RouteDTO): Promise<User | null> {
    const { getSession } = this.authStorageCookie;
    const session = await getSession(route.request.headers.get("cookie"));
    const userJson = session.get("user");

    if (!userJson) return null;
    return userJson;
  }

  static async setAuthStorage(route: RouteDTO, user: User, to?: string) {
    const { getSession, commitSession } = this.authStorageCookie;

    const session = await getSession(route.request.headers.get("cookie"));
    session.set("user", user);

    if (to) {
      return RedirectServerAdapter.to(to, {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    }

    return Response.json(
      { closeModalKey: "registrationModal" },
      { headers: { "Set-Cookie": await commitSession(session) } },
    );
  }

  static async destroyAuthStorage(route: RouteDTO) {
    const { getSession, destroySession } = this.authStorageCookie;

    const session = await getSession(route.request.headers.get("cookie"));

    return redirect("/sign-in", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }
}

export { AuthService };
