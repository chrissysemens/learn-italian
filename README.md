# Learn Italian

An Expo and React Native app for learning Italian through CEFR-aligned competencies, exercises, evaluations, and learner progress.

## Requirements

- Node.js 22.13 or newer
- npm
- Expo SDK 57
- Android SDK 36 for Android development
- Xcode 26.4 or newer for iOS development

## Setup

Install dependencies:

```sh
npm install
```

Create a `.env` file in the project root. It is ignored by Git. Add the Firebase Web app configuration and the learner document ID:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
EXPO_PUBLIC_LEARNER_ID=your_firestore_learner_document_id
```

The Firebase configuration is read by `src/config/firebase.ts`. The app expects a learner document at:

```text
learners/{EXPO_PUBLIC_LEARNER_ID}
```

The learner document should include `firstName`, `surname`, `email`, `currentLevel`, and `createdAt`.

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

- `App.tsx` - application entry screen and current integration test harness
- `src/config` - Firebase and environment configuration
- `src/domain` - domain models and barrel exports
- `src/data` - repository interfaces and Firestore/mock implementations
- `src/services/exercise` - exercise generation and answer evaluation
- `src/services/learning` - learning rules and progress updates
- `src/curriculum` - CEFR curriculum data
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
