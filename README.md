<p align="center">
  <img src="assets/logo.png" alt="Percoso logo" width="200" />
</p>

<h1 align="center">Percoso (path)</h1>

<h3 align="center">Daily Italian exercises</h3>

Percoso helps you build your Italian through daily practice tailored to your level. With CEFR-aligned exercises, AI-generated questions and answer feedback, and progress tracking, the app helps you strengthen your skills and revisit areas that need more practice.

## Technology Stack

- **App:** Expo SDK 57, React Native 0.86, and React 19.2
- **Language:** TypeScript
- **Backend:** Firebase Cloud Functions with Node.js 24
- **Database:** Cloud Firestore
- **AI:** OpenAI for exercise generation and answer evaluation
- **Validation:** Zod schemas shared between the app and backend through `@percoso/shared`
- **UI:** Manrope fonts, React Native SVG, and safe area support
- **Instagram Studio:** React 18, Vite 6, TypeScript, and html-to-image for PNG exports

## Requirements

- Node.js 22.13 or newer
- Node.js 24 for the Firebase Functions backend
- npm
- Firebase CLI for running the Functions emulator or deploying the backend
- Expo SDK 57
- Android SDK 36 for Android development
- Xcode 26.4 or newer for iOS development

## Setup

Install and build the shared package, then install the app and backend dependencies:

```sh
npm install --prefix shared
npm run build --prefix shared
npm install
npm install --prefix functions
```

Create a `.env` file in the project root. It is ignored by Git. Add the Firebase Web app configuration and the learner document ID:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_LEARNER_ID=your_firestore_learner_document_id
```

The Firebase configuration is read by `src/config/firebase.ts`. The app expects a learner document at:

```text
learners/{EXPO_PUBLIC_LEARNER_ID}
```

The learner document should include `firstName`, `surname`, `email`, `currentLevel`, and `createdAt`.

### Local Backend

For local AI exercises, create `functions/.secret.local` with your OpenAI API key. Keep this file out of version control:

```env
OPENAI_API_KEY=your_openai_api_key
```

Update the Functions emulator host in `src/config/firebase.ts` to your development machine's LAN IP address when testing on a physical device, or a host reachable from your simulator or browser. It currently uses `192.168.0.103:5001`.

Start the Functions emulator in a separate terminal:

```sh
npm run emulator
```

This runs the Functions emulator only; Firestore still connects to your configured Firebase project.

### Firebase Functions

The backend exports two callable functions from `functions/src/index.ts`:

- `generateExercise` — generates fill-in-the-blank and English-to-Italian translation exercises with OpenAI.
- `evaluateExercise` — evaluates submitted answers with OpenAI and returns structured feedback.

Prompts live in `functions/src/prompts`; shared types and response schemas live in `shared`.

Build the backend from the repository root:

```sh
npm run build --prefix shared
npm install ./shared --prefix functions
npm run build --prefix functions
```

To deploy, select your Firebase project, configure the production secret, and deploy the Functions:

```sh
firebase use your-project-id
firebase functions:secrets:set OPENAI_API_KEY
npm run deploy --prefix functions
```

The local `.secret.local` file is ignored by Git and is only used by the emulator. To view deployed backend logs, run `npm run logs --prefix functions`.

### Instagram Studio

`instagram-studio` is a standalone local tool for turning reviewed exercise JSON into three 1080 × 1350 Instagram carousel slides: Challenge, Answers, and Grammar Tip. It also provides a caption to copy; uploads to Instagram are manual.

From the repository root:

```sh
npm install --prefix instagram-studio
npm run dev --prefix instagram-studio
```

Open the address printed by Vite, edit the exercise JSON, update the preview, and export the three PNGs. The studio uses its own content format rather than the app's exercise schema.

See the [Instagram Studio README](instagram-studio/README.md) for the content format, export workflow, and styling notes. To build it, run `npm run build --prefix instagram-studio`.

## Run

Start the Expo development server:

```sh
npm start
```

Run the Android target:

```sh
npm run android
```

Run the iOS target:

```sh
npm run ios
```

Run the web target:

```sh
npm run web
```

For a development-client build, use:

```sh
npx expo start --dev-client
```

## Validation

Run the TypeScript check:

```sh
npx tsc --noEmit
```

Run Expo diagnostics:

```sh
npx expo-doctor
```

## Project Structure

- `App.tsx` - application entry point, font loading, and learner initialization
- `src/screens` - splash, home, and error screens
- `src/components` - reusable UI and exercise components
- `src/config` - Firebase and environment configuration
- `src/domain` - domain models and barrel exports
- `src/data` - repository interfaces and Firestore/mock implementations
- `src/services/exercise` - exercise generation and answer evaluation
- `src/services/learning` - learning rules and progress updates
- `src/curriculum` - CEFR curriculum data
- `functions/src` - AI exercise generation and evaluation Cloud Functions
- `shared` - shared exercise types and Zod schemas
- `instagram-studio` - local Instagram carousel editor and PNG exporter
- `ladder` - learning progression notes by CEFR level
- `TODO.md` - deferred product and learning-model decisions

## Firestore Collections

The current data model uses:

```text
learners/{learnerId}
learners/{learnerId}/competencyProgress/{competencyId}
learners/{learnerId}/errors/{competencyId}__{errorType}
```

Use Firebase Authentication and Firestore Security Rules before using the app with production data.
