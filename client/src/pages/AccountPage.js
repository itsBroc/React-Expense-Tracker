import React, { useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlobalContext } from '../context/GlobalState';
import { formatCurrency, minorToMajor } from '../utils/finance';

const defaultSettings = {
  baseCurrency: 'AUD',
  locale: 'en-AU',
  timezone: 'Australia/Sydney',
  monthStartDay: 1,
  theme: 'system'
};

const initialAccount = {
  name: '',
  type: 'checking',
  openingBalance: '',
  notes: ''
};

const accountTypes = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit_card', label: 'Credit card' },
  { value: 'cash', label: 'Cash' },
  { value: 'investment', label: 'Investment' },
  { value: 'loan', label: 'Loan' },
  { value: 'other', label: 'Other' }
];

export const AccountPage = () => {
  const { authError, configured, config, isAuthenticated, profile, signIn, signOut } = useAuth();
  const { accounts, addAccount, deleteAccount, updateUserProfile, userProfile } = useContext(GlobalContext);
  const [settings, setSettings] = useState(defaultSettings);
  const [accountForm, setAccountForm] = useState(initialAccount);

  useEffect(() => {
    if (!userProfile) {
      return;
    }

    setSettings({
      baseCurrency: userProfile.baseCurrency || defaultSettings.baseCurrency,
      locale: userProfile.locale || defaultSettings.locale,
      timezone: userProfile.timezone || defaultSettings.timezone,
      monthStartDay: userProfile.monthStartDay || defaultSettings.monthStartDay,
      theme: userProfile.theme || defaultSettings.theme
    });
  }, [userProfile]);

  const handleChange = event => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.value
    });
  };

  const handleAccountChange = event => {
    setAccountForm({
      ...accountForm,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = event => {
    event.preventDefault();

    updateUserProfile({
      ...settings,
      baseCurrency: settings.baseCurrency.toUpperCase(),
      monthStartDay: Number(settings.monthStartDay)
    });
  };

  const handleAccountSubmit = event => {
    event.preventDefault();

    if (!accountForm.name.trim()) {
      return;
    }

    addAccount({
      ...accountForm,
      name: accountForm.name.trim(),
      openingBalance: accountForm.openingBalance || '0',
      currency: settings.baseCurrency
    });
    setAccountForm(initialAccount);
  };

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
          <h2>Preferences</h2>
          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="baseCurrency">Base currency</label>
              <input id="baseCurrency" name="baseCurrency" type="text" maxLength="3" value={settings.baseCurrency} onChange={handleChange}/>
            </div>
            <div className="form-control">
              <label htmlFor="locale">Locale</label>
              <input id="locale" name="locale" type="text" value={settings.locale} onChange={handleChange}/>
            </div>
            <div className="form-control">
              <label htmlFor="timezone">Timezone</label>
              <input id="timezone" name="timezone" type="text" value={settings.timezone} onChange={handleChange}/>
            </div>
            <div className="form-row">
              <div className="form-control">
                <label htmlFor="monthStartDay">Month starts</label>
                <input id="monthStartDay" name="monthStartDay" type="number" min="1" max="28" value={settings.monthStartDay} onChange={handleChange}/>
              </div>
              <div className="form-control">
                <label htmlFor="theme">Theme</label>
                <select id="theme" name="theme" value={settings.theme} onChange={handleChange}>
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
            <button className="btn">Save preferences</button>
          </form>
        </section>
      </div>

      <section className="panel architecture-panel">
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

      <div className="management-layout account-management">
        <form className="panel management-form" onSubmit={handleAccountSubmit}>
          <div>
            <h2>Add account</h2>
            <p>Track cash, bank, credit, and investment balances separately.</p>
          </div>
          <div className="form-control">
            <label htmlFor="account-name">Account name</label>
            <input id="account-name" name="name" type="text" value={accountForm.name} onChange={handleAccountChange} placeholder="Everyday account"/>
          </div>
          <div className="form-row">
            <div className="form-control">
              <label htmlFor="account-type">Type</label>
              <select id="account-type" name="type" value={accountForm.type} onChange={handleAccountChange}>
                {accountTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="opening-balance">Opening balance</label>
              <input id="opening-balance" name="openingBalance" type="number" step="0.01" value={accountForm.openingBalance} onChange={handleAccountChange} placeholder="0.00"/>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="account-notes">Notes</label>
            <input id="account-notes" name="notes" type="text" value={accountForm.notes} onChange={handleAccountChange} placeholder="Optional account context"/>
          </div>
          <button className="btn">Create account</button>
        </form>

        <div className="account-list">
          {accounts.length === 0 && <div className="panel empty-state">No accounts yet. Add your first account to start separating balances.</div>}
          {accounts.map(account => (
            <article className="panel account-card" key={account._id}>
              <div>
                <div className="card-kicker">{accountTypes.find(type => type.value === account.type)?.label || account.type}</div>
                <h2>{account.name}</h2>
                {account.notes && <p>{account.notes}</p>}
              </div>
              <strong>{formatCurrency(minorToMajor(account.currentBalanceMinor || 0))}</strong>
              <div className="card-actions">
                <button className="delete-btn inline-delete" onClick={() => deleteAccount(account._id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
