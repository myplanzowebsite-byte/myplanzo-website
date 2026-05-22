import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Verifies a Google Identity Services ID token (the "credential" returned by the
 * GIS button) and returns the identity claims we care about.
 *
 * We only need the public client ID — there is no code exchange and no client
 * secret in the ID-token flow. The token's signature, audience, issuer and
 * expiry are all checked here; callers can trust the returned claims.
 */

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

const GOOGLE_ISSUERS = ["accounts.google.com", "https://accounts.google.com"];

export type GoogleIdentity = {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  picture: string | null;
};

export async function verifyGoogleIdToken(
  credential: string,
): Promise<GoogleIdentity | null> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");

  try {
    const { payload } = await jwtVerify(credential, GOOGLE_JWKS, {
      audience: clientId,
      issuer: GOOGLE_ISSUERS,
    });

    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email : null;
    if (!sub || !email) return null;

    return {
      sub,
      email: email.toLowerCase(),
      emailVerified: payload.email_verified === true,
      name: typeof payload.name === "string" ? payload.name : null,
      picture: typeof payload.picture === "string" ? payload.picture : null,
    };
  } catch {
    return null;
  }
}
