import React from 'react';
import { useAuth } from '../context/AuthContext';

export const AccountPage = () => {
  const { authError, configured, config, isAuthenticated, profile, signIn, signOut } = useAuth();

  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Sign in and user data</h1>
        </div>
      </header>

      <div className="account-grid">
        <section className="panel account-panel">
          <h2>Authentication</h2>
          <p>
            This app is prepared for Amazon Cognito Hosted UI. Once configured, users sign in through Cognito and the API verifies their tokens before reading or writing records.
          </p>
          {authError && <div className="notice">{authError}</div>}
          <div className="account-status">
            <span>Status</span>
            <strong>{isAuthenticated ? 'Signed in' : configured ? 'Ready for sign in' : 'Local development mode'}</strong>
          </div>
          <div className="card-actions">
            {!isAuthenticated && <button className="btn compact" onClick={signIn}>Sign in with Cognito</button>}
            {isAuthenticated && <button className="secondary-btn" onClick={signOut}>Sign out</button>}
          </div>
        </section>

        <section className="panel account-panel">
          <h2>Profile</h2>
          {isAuthenticated ? (
            <dl className="profile-list">
              <div>
                <dt>Name</dt>
                <dd>{profile?.name || profile?.['cognito:username'] || 'Not provided'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{profile?.email || 'Not provided'}</dd>
              </div>
              <div>
                <dt>User id</dt>
                <dd>{profile?.sub}</dd>
              </div>
            </dl>
          ) : (
            <p className="empty-state">No signed-in profile yet.</p>
          )}
        </section>

        <section className="panel account-panel">
          <h2>Cognito setup values</h2>
          <dl className="profile-list">
            <div>
              <dt>Domain</dt>
              <dd>{config.domain || 'REACT_APP_COGNITO_DOMAIN not set'}</dd>
            </div>
            <div>
              <dt>Client id</dt>
              <dd>{config.clientId || 'REACT_APP_COGNITO_CLIENT_ID not set'}</dd>
            </div>
            <div>
              <dt>User pool</dt>
              <dd>{config.userPoolId || 'REACT_APP_COGNITO_USER_POOL_ID not set'}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
};
