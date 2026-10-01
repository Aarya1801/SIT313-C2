# DEV@Deakin - SIT313 Task C2

This project connects the React newsletter form to the existing Express backend. A valid public subscription request is sent to SendGrid, which queues the DEV@Deakin welcome email. Newsletter subscription does not require an account and does not alter Free or Paid plan data.

## Requirements

- Node.js 20 or newer
- A SendGrid API key with permission to send mail
- A sender address verified in SendGrid
- Firebase configuration for the existing account features

## Local configuration

1. Copy `.env.example` to `.env`.
2. Fill in the existing Firebase and JWT settings used by the D1 application.
3. Set `SENDGRID_API_KEY` to the server-side SendGrid API key.
4. Set `SENDGRID_FROM_EMAIL` to the verified SendGrid sender address.

Keep both SendGrid values server-side. Do not prefix them with `VITE_`, commit `.env`, or place either value in frontend code.

The frontend uses `VITE_API_URL`, which defaults to `http://localhost:3001/api`. The Express server allows the local Vite origin `http://localhost:5173`.

## Install and start

```sh
npm install
```

Start the backend and frontend in separate terminals:

```sh
npm run server
```

```sh
npm run dev
```

## Automated verification

```sh
npm test
npm run lint
npm run build
```

The newsletter tests use an isolated Express server and an injected fake email sender. They do not initialize Firebase or contact SendGrid, so a passing test does not prove that a real email was accepted or delivered.

## Manual newsletter verification

1. Start the backend and frontend with a valid local `.env`.
2. Open the homepage and submit a valid email address in the newsletter form.
3. Confirm the form is disabled and displays `Subscribing…` while pending.
4. Confirm the input clears only after an accepted request and remains populated after failure.
5. Confirm the backend terminal prints the actual `SendGrid status: 202` response.
6. Confirm the welcome email arrives, noting that provider acceptance is not a guarantee of delivery.
7. Check invalid input, missing configuration, and provider failure behaviour without exposing credentials or recipient addresses in logs.
