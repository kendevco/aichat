# aichat

AIChat based upon Sonny Sangha's ChatGPT Messenger 2.0 with REACT! (Next.js 13, Firebase, Tailwind CSS, TypeScript) (https://www.youtube.com/watch?v=V6Hq_EX2LLM)

## Credits

- [Sonny Sangha](https://www.youtube.com/channel/UCqeTj_QAnNlmt7FwzNwHZnA) for the original ChatGPT Messenger 2.0 tutorial
- [Ali Samir] (https://github.com/alisamirali) for sharing his faithful version of the project which this was based upon.
- [Next.js](https://nextjs.org/) for the framework
- [Firebase](https://firebase.google.com/) for the backend
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [OpenAI](https://openai.com/) for the chatbot API
- [TypeScript](https://www.typescriptlang.org/) for the improved code reliability and readability

## Requirements
- Node.js (version 14 or later)
- npm or Yarn package manager
- An OpenAI API key (https://platform.openai.com/)
- Google Firebase: (https://console.firebase.google.com/project/)
- Google Authentication: (https://console.cloud.google.com/apis/credentials/oauthclient/)

## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file with your Firebase configuration, OpenAI API key, and any other necessary environment variables
4. Start the development server with `npm run dev`

## Features

- Real-time chat with OpenAI-powered responses
- Authentication with NextAuth.js
- Firebase backend with Firestore and Firebase Authentication
- Tailwind CSS for easy and responsive styling
- TypeScript for improved code readability and reliability

## Getting Started

To get started, clone the repository to your local machine and install the project dependencies using npm or Yarn. You also need to set up your OpenAI API key as an environment variable.

```bash
# clone the repository
git clone https://github.com/your-username/aichat.git

# change directory to the project folder
cd aichat

# install dependencies using npm
npm install

# or, install dependencies using Yarn
yarn install

# set up environment variables
echo "OPENAI_API_KEY=<your-api-key>" > .env.local

# start the development server
npm run dev

# or, start the development server using Yarn
yarn dev
```
Once rendered the file, ensure you've updated/created your own .env.local file and replace the following with your own values:
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://your-app.com/api/auth/callback/google
NEXTAUTH_URL=https://your-app.com
NEXTAUTH_SECRET=your-nextauth-secret
OPEN_AI_KEY=your-openai-api-key
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./secrets/serviceAccountKey.json
```

## License

This project is licensed under the [MIT License](https://github.com/<USERNAME>/<REPO>/blob/main/LICENSE).
