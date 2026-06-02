import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const tokenKey = 'expenseTracker.auth.tokens';
const verifierKey = 'expenseTracker.auth.pkceVerifier';

function getConfig() {
  return {
    clientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
    domain: process.env.REACT_APP_COGNITO_DOMAIN,
    redirectUri: process.env.REACT_APP_COGNITO_REDIRECT_URI || window.location.origin,
    region: process.env.REACT_APP_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID
  };
}

function isConfigured(config) {
  return Boolean(config.clientId && config.domain);
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function randomString() {
  const values = new Uint8Array(32);
  window.crypto.getRandomValues(values);
  return base64UrlEncode(values);
}

async function createChallenge(verifier) {
  const encoded = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', encoded);
  return base64UrlEncode(digest);
}

function decodeJwt(token) {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=');
    return JSON.parse(atob(padded));
  } catch (error) {
    return null;
  }
}

function readStoredTokens() {
  try {
    return JSON.parse(localStorage.getItem(tokenKey)) || null;
  } catch (error) {
    return null;
  }
}

function writeTokens(tokens) {
  localStorage.setItem(tokenKey, JSON.stringify(tokens));
  axios.defaults.headers.common.Authorization = `Bearer ${tokens.access_token}`;
}

function clearTokens() {
  localStorage.removeItem(tokenKey);
  delete axios.defaults.headers.common.Authorization;
}

async function exchangeCodeForTokens(code, config) {
  const verifier = sessionStorage.getItem(verifierKey);
  const body = new URLSearchParams({
    client_id: config.clientId,
    code,
    code_verifier: verifier,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUri
  });

  const res = await fetch(`${config.domain}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (!res.ok) {
    throw new Error('Unable to finish Cognito sign in');
  }

  return res.json();
}

export const AuthProvider = ({ children }) => {
  const config = useMemo(() => getConfig(), []);
  const [tokens, setTokens] = useState(() => {
    const storedTokens = readStoredTokens();

    if (storedTokens?.access_token) {
      axios.defaults.headers.common.Authorization = `Bearer ${storedTokens.access_token}`;
    }

    return storedTokens;
  });
  const [authError, setAuthError] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const configured = isConfigured(config);
  const profile = decodeJwt(tokens?.id_token) || decodeJwt(tokens?.access_token);
  const isAuthenticated = Boolean(tokens?.access_token);

  useEffect(() => {
    if (tokens?.access_token) {
      axios.defaults.headers.common.Authorization = `Bearer ${tokens.access_token}`;
    }
  }, [tokens]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!configured || !code) {
      setAuthReady(true);
      return;
    }

    exchangeCodeForTokens(code, config)
      .then(newTokens => {
        writeTokens(newTokens);
        setTokens(newTokens);
        sessionStorage.removeItem(verifierKey);
        window.history.replaceState({}, document.title, window.location.pathname);
      })
      .catch(error => setAuthError(error.message))
      .finally(() => setAuthReady(true));
  }, [configured, config]);

  const signIn = async () => {
    if (!configured) {
      setAuthError('Cognito is not configured yet. Add the React app environment variables first.');
      return;
    }

    const verifier = randomString();
    const challenge = await createChallenge(verifier);
    sessionStorage.setItem(verifierKey, verifier);

    const params = new URLSearchParams({
      client_id: config.clientId,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: 'openid email profile'
    });

    window.location.assign(`${config.domain}/oauth2/authorize?${params.toString()}`);
  };

  const signOut = () => {
    clearTokens();
    setTokens(null);

    if (configured) {
      const params = new URLSearchParams({
        client_id: config.clientId,
        logout_uri: config.redirectUri
      });
      window.location.assign(`${config.domain}/logout?${params.toString()}`);
    }
  };

  return (
    <AuthContext.Provider value={{
      authError,
      authReady,
      configured,
      config,
      isAuthenticated,
      profile,
      signIn,
      signOut,
      tokens
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
