# spicenet-react-native-assignment

A React Native mobile application built with Expo that implements a cryptocurrency wallet interface with real-time price tracking, swap functionality and biometric authentication.

## Features

- Real-time cryptocurrency price tracking
- Interactive wallet interface with asset management
- Biometric authentication for secure swap transactions
- Smooth animations and transitions
- Pixel-perfect UI implementation
- TypeScript for type safety and better development experience

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Context API
- **Navigation**: React Navigation
- **UI Components**: Custom components with React Native's built-in components
- **Styling**: React Native StyleSheet
- **Icons**: Expo Vector Icons
- **Charts**: react-native-svg-charts
- **Authentication**: expo-local-authentication
- **API**: CoinGecko API for cryptocurrency data

## UI Libraries and Rationale

1. **Expo Vector Icons**

   - Used for consistent iconography across the app
   - Provides a wide range of icons that match the design requirements
   - Easy to customize and style

2. **React Native SVG Charts**

   - Chosen for smooth, responsive chart rendering
   - Better performance compared to other charting libraries
   - Native SVG support for crisp graphics

3. **Expo Linear Gradient**
   - Used for creating beautiful gradient backgrounds
   - Matches the design mockups perfectly
   - Better performance than CSS gradients

## API Integration

### CoinGecko API

- Used for fetching real-time cryptocurrency prices
- Implementation details:
  - Centralized price management through PriceContext
  - Batch endpoint for efficient data fetching
  - 5-minute refresh interval to stay within rate limits
  - Error handling for failed requests
  - TypeScript interfaces for type safety

### Challenges and Solutions

1. **Rate Limiting**

   - Challenge: CoinGecko's free API has rate limits
   - Solution: Implemented batch requests and 5-minute refresh interval
   - Result: Efficient data fetching while staying within limits

2. **Real-time Updates**
   - Challenge: Need to keep prices current without overwhelming the API
   - Solution: Centralized price management with controlled refresh
   - Result: Consistent data across the app with minimal API calls

## Biometric Authentication

### Implementation

- Used `expo-local-authentication` for Face ID/Touch ID integration
- Native implementation for better performance and reliability
- Seamless integration with the swap interface

### Process

1. User initiates swap action
2. Biometric prompt appears
3. Authentication success triggers swap completion
4. User receives success feedback

### Technical Details

- Native iOS implementation for Face ID
- Proper permission handling in Info.plist
- Secure authentication flow
- Graceful fallback handling

## Code Quality

### Architecture

- Clean component structure
- Separation of concerns
- Reusable components
- TypeScript for type safety

### State Management

- Context API for global state
- Local state for component-specific data
- Efficient data flow

### Performance

- Optimized re-renders
- Efficient API calls
- Smooth animations
- Memory leak prevention

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/CryptoWalletApp.git
cd CryptoWalletApp
```

2. Install JavaScript dependencies:

```bash
npm install
# or
yarn install
```

3. Install iOS dependencies (required for Face ID):

```bash
cd ios
pod install
cd ..
```

4. Start the development server:

```bash
npx expo start
```

5. Run on iOS (with native features):

```bash
npx expo run:ios
```

6. Run on Android:

```bash
npx expo run:android
```

### Development Modes

The app can be run in two different modes:

1. **Expo Go Mode** (Limited Features):

   - Use `npx expo start` and scan QR code with Expo Go app
   - Face ID/Touch ID will not work
   - Good for quick development and testing basic features

2. **Development Build Mode** (Full Features):
   - Use `npx expo run:ios` or `npx expo run:android`
   - All native features (Face ID/Touch ID) will work
   - Required for testing biometric authentication
   - Requires pod installation for iOS

Note: For testing biometric authentication and other native features, always use the Development Build Mode.

## Project Structure

```
CryptoWalletApp/
├── assets/              # Images and static assets
├── components/          # Reusable UI components
├── context/            # React Context providers
├── data/               # Static data and types
├── navigation/         # Navigation configuration
├── screens/            # Screen components
├── types/              # TypeScript type definitions
└── App.tsx            # Root component
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
