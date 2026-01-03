# Farmer App Client

A React Native mobile application for farmers to manage their farm activities, logs, and registrations. Built with Expo and NativeWind.

## Features

The application provides a comprehensive suite of tools for farm management:

- **Authentication & Onboarding**
  - **Login Screen**: Secure user authentication.
  - **User Registration**: Sign up for new farmer accounts.
  - **Farm Registration**: Register and manage farm details.

- **Farm Management Logs**
  - **Home Dashboard**: Quick access to all main features.
  - **Planting Log**: Record planting activities (crop type, date, location).
  - **Input Log**: Track agricultural inputs used (fertilizers, seeds, etc.).
  - **Harvest Log**: Log harvest yields and details.
  - **History**: View past activities and logs.

## Technologies Used

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **Icons**: [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
- **Date Picking**: @react-native-community/datetimepicker

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed (LTS recommended)
- npm or yarn package manager
- Expo Go app installed on your mobile device (iOS/Android) or an emulator setup.

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd client-farmer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
## Running the App

To start the development server:

```bash
npm start
```
or
```bash
npx expo start
```

- **Scan the QR code** with the Expo Go app (Android) or Camera app (iOS).
- Press `a` to open in Android Emulator.
- Press `i` to open in iOS Simulator.
- Press `w` to open in Web Browser.

## Project Structure

```text
client-farmer/
├── src/
│   ├── navigation/       # Navigation configuration
│   └── screens/          # Application screens
│       ├── FarmRegistrationScreen.js
│       ├── HarvestLogScreen.js
│       ├── HistoryScreen.js
│       ├── HomeScreen.js
│       ├── InputLogScreen.js
│       ├── LoginScreen.js
│       ├── PlantingLogScreen.js
│       └── UserRegistrationScreen.js
├── assets/               # Static assets (images, fonts)
├── App.js                # Entry point
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```