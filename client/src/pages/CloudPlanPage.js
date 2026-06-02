import React from 'react';

const cloudFeatures = [
  {
    title: 'Cognito user accounts',
    body: 'The client now supports Cognito Hosted UI sign in and sign out. The backend can verify Cognito JWTs before serving private data.'
  },
  {
    title: 'User-scoped records',
    body: 'Transactions, goals, and budgets now carry a user id so each signed-in user can have isolated data.'
  },
  {
    title: 'IAM-secured backend',
    body: 'When deployed, use IAM roles for Lambda or ECS tasks to access databases, S3 exports, and logs without hard-coded cloud credentials.'
  },
  {
    title: 'Export and backups',
    body: 'A strong next feature is CSV or PDF report export to S3 with restricted access and lifecycle rules.'
  }
];

const setupSteps = [
  'Create a Cognito user pool.',
  'Create an app client without a client secret for the React app.',
  'Configure a Hosted UI domain.',
  'Add http://localhost:3000 as an allowed callback and logout URL for development.',
  'Copy the region, user pool id, app client id, and domain into the example env files.'
];

export const CloudPlanPage = () => {
  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">Cloud plan</p>
          <h1>Cognito-ready AWS foundation</h1>
        </div>
      </header>
      <div className="cloud-grid">
        {cloudFeatures.map(feature => (
          <article className="panel" key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.body}</p>
          </article>
        ))}
      </div>
      <section className="panel architecture-panel">
        <h2>Suggested architecture</h2>
        <div className="architecture-flow">
          <span>React client</span>
          <span>Cognito Hosted UI</span>
          <span>API Gateway</span>
          <span>Lambda or ECS</span>
          <span>MongoDB Atlas or DynamoDB</span>
          <span>S3 reports</span>
          <span>CloudWatch logs</span>
        </div>
      </section>
      <section className="panel architecture-panel">
        <h2>Setup checklist</h2>
        <ol className="setup-list">
          {setupSteps.map(step => <li key={step}>{step}</li>)}
        </ol>
      </section>
    </section>
  );
};
