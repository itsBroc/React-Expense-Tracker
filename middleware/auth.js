const crypto = require('crypto');

const jwksCache = {
    keys: null,
    fetchedAt: 0
};

function base64UrlDecode(value) {
    return Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

function parseJwt(token) {
    const [header, payload, signature] = token.split('.');

    if (!header || !payload || !signature) {
        throw new Error('Invalid token format');
    }

    return {
        header: JSON.parse(base64UrlDecode(header)),
        payload: JSON.parse(base64UrlDecode(payload)),
        signingInput: `${header}.${payload}`,
        signature
    };
}

function getCognitoConfig() {
    const region = process.env.COGNITO_REGION;
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    const clientId = process.env.COGNITO_CLIENT_ID;

    return {
        enabled: Boolean(region && userPoolId),
        clientId,
        issuer: region && userPoolId ? `https://cognito-idp.${region}.amazonaws.com/${userPoolId}` : null,
        region,
        userPoolId
    };
}

async function getJwks(config) {
    const cacheTtl = 60 * 60 * 1000;

    if (jwksCache.keys && Date.now() - jwksCache.fetchedAt < cacheTtl) {
        return jwksCache.keys;
    }

    const res = await fetch(`${config.issuer}/.well-known/jwks.json`);

    if (!res.ok) {
        throw new Error('Unable to fetch Cognito signing keys');
    }

    const jwks = await res.json();
    jwksCache.keys = jwks.keys;
    jwksCache.fetchedAt = Date.now();

    return jwks.keys;
}

function verifySignature(tokenParts, jwk) {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(tokenParts.signingInput);
    verifier.end();

    const publicKey = crypto.createPublicKey({
        key: jwk,
        format: 'jwk'
    });

    return verifier.verify(publicKey, tokenParts.signature, 'base64url');
}

function validateClaims(payload, config) {
    const now = Math.floor(Date.now() / 1000);

    if (payload.iss !== config.issuer) {
        throw new Error('Invalid token issuer');
    }

    if (!payload.exp || payload.exp <= now) {
        throw new Error('Token has expired');
    }

    if (!['access', 'id'].includes(payload.token_use)) {
        throw new Error('Invalid token type');
    }

    const tokenClientId = payload.client_id || payload.aud;

    if (config.clientId && tokenClientId !== config.clientId) {
        throw new Error('Invalid token client');
    }
}

async function verifyCognitoToken(token, config) {
    const tokenParts = parseJwt(token);
    const keys = await getJwks(config);
    const key = keys.find(jwk => jwk.kid === tokenParts.header.kid);

    if (!key) {
        throw new Error('No matching Cognito signing key');
    }

    if (!verifySignature(tokenParts, key)) {
        throw new Error('Invalid token signature');
    }

    validateClaims(tokenParts.payload, config);

    return tokenParts.payload;
}

exports.protect = async (req, res, next) => {
    const config = getCognitoConfig();

    if (!config.enabled) {
        req.user = {
            id: 'local-dev-user',
            email: 'local-dev@example.com',
            name: 'Local development',
            mode: 'local'
        };
        return next();
    }

    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    try {
        const payload = await verifyCognitoToken(token, config);

        req.user = {
            id: payload.sub,
            email: payload.email || payload.username,
            name: payload.name || payload['cognito:username'],
            mode: 'cognito'
        };

        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};
