import { createCookieSessionStorage } from "react-router";
import { name } from "../../../package.json";
import { environmentVariables } from "./environmentVariables";

const authStorage = createCookieSessionStorage({
  cookie: {
    name: `${name}-auth-storage`,
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [environmentVariables.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export { authStorage };
