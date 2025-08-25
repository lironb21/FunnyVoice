# FunnyVoice - Mobile Voice Effects App

A beautiful and modern React Native mobile application built with Expo that allows users to record and apply various voice effects to their audio recordings.

## 🚀 Features

### 🏠 Home Screen
- **Featured Voices**: Browse through different voice effects (Robot, Alien, Chipmunk, Echo, Deep, Whisper)
- **Quick Actions**: Easy access to Record, Play, Share, and Settings
- **Recent Recordings**: View and play your latest voice recordings
- **Modern UI**: Beautiful cards, shadows, and smooth animations

### 🎤 Record Screen
- **Voice Effect Selection**: Choose from multiple voice effects
- **Recording Controls**: Large, intuitive recording button
- **Real-time Stats**: Monitor recording duration, file size, and quality
- **Professional Interface**: Clean, focused recording experience

### 👤 Profile Screen
- **User Profile**: Display user information and avatar
- **Statistics**: Track recordings, favorites, and shared content
- **Settings Menu**: Access to profile editing, notifications, privacy, and support

### 🧭 Navigation
- **Bottom Tab Navigation**: Seamless switching between Home, Record, and Profile
- **Active State Indicators**: Visual feedback for current screen
- **Smooth Transitions**: Professional app-like navigation experience

## 🛠️ Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript development
- **Expo Vector Icons**: Beautiful icon library
- **Modern React Hooks**: State management and component logic

## 📱 Platform Support

- ✅ **Android**: Full support with native performance
- ✅ **iOS**: Full support (requires macOS for building)
- ✅ **Web**: Can run in web browsers for development

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd FunnyVoiceApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Install Expo Go from App Store (iOS) or Google Play Store (Android)
   - Scan the QR code displayed in your terminal
   - The app will load on your device

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser

## 🎨 Design Features

- **Modern Material Design**: Clean, intuitive interface
- **Responsive Layout**: Adapts to different screen sizes
- **Beautiful Colors**: Professional color scheme with proper contrast
- **Smooth Animations**: Subtle shadows and transitions
- **Touch-Friendly**: Proper touch targets and spacing

## 🔧 Customization

### Adding New Voice Effects
Edit the `renderHomeScreen` function in `App.tsx` to add more voice effects to the featured voices section.

### Modifying Colors
Update the color values in the `styles` object to match your brand colors.

### Adding New Screens
1. Create a new render function (e.g., `renderSettingsScreen`)
2. Add the screen to the `renderScreen` switch statement
3. Add a new navigation tab in the bottom navigation

## 📱 Testing

### On Physical Device
1. Install Expo Go app
2. Ensure your phone and computer are on the same network
3. Scan the QR code from the terminal

### On Emulator
- **Android**: Use Android Studio's AVD Manager
- **iOS**: Use Xcode Simulator (macOS only)

## 🚀 Deployment

### Building for Production
```bash
expo build:android  # For Android APK
expo build:ios      # For iOS (requires macOS)
```

### Publishing to App Stores
1. Configure app.json with your app details
2. Build the production version
3. Submit to Google Play Store and/or Apple App Store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:
1. Check the Expo documentation
2. Review React Native troubleshooting guides
3. Open an issue in the repository

## 🎯 Future Enhancements

- [ ] Real voice recording functionality
- [ ] Voice effect processing
- [ ] Cloud storage for recordings
- [ ] Social sharing features
- [ ] User authentication
- [ ] Premium voice effects
- [ ] Offline mode support

---

**Happy coding! 🎉**

Built with ❤️ using React Native and Expo
