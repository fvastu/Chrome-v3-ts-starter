# Chrome Extension Starter 🚀 Manifest V3 + TypeScript + Webpack

## Table of Contents
- [Introduction](#introduction)
- [Configuration](#configuration)
- [Manifest](#manifest)
- [Author](#author)
- [License](#license)

## Introduction
🚀 Welcome to the Chrome Extension Starter Kit, your express ticket to crafting amazing Chrome extensions effortlessly! This kit is more than just a template—it's a magical tool that follows the Manifest V3 specification, making your extension development a breeze. With TypeScript and Webpack working harmoniously, you'll have a fully functional extension up and running in seconds.

## Features
- **Manifest V3 Compliant:** The project structure is defined to comply with the Manifest V3 specification, ensuring compatibility with the latest Chrome extension standards.

- **Out-of-the-Box Ready:** The starter kit is ready to use immediately, allowing you to focus on building your extension without the need for extensive configuration.

- **Webpack Integration:** Fully integrated with Webpack, enabling efficient bundling and optimization of your extension's codebase.

- **Quick Setup:** With TypeScript support and predefined scripts, you can have a functional Chrome extension up and running in a matter of seconds.

## Configuration
1. **Clone the Repository:**
   - Start by cloning this repository to your local machine.

2. **Navigate to the Project Directory:**
   - Open your preferred file explorer or terminal and navigate to the directory where you cloned the repository.

3. **Install Dependencies:**
   - Install the project dependencies using the package manager Yarn.

4. **Adding Icons:**
   - Replace the default icons in the `assets/icons` directory with your own.
   - Update the manifest file (`manifest.json`) with the correct paths and sizes for your new icons.

5. **Customizing Product Name:**
   - Open the `manifest.json` file.
   - Locate the `name` field and replace "__MSG_appName__" with your desired product name.

6. **Going into Production:**
   - Build your extension for production. This process generates a `dist` directory containing your optimized extension.
   - Load your extension into Chrome by navigating to `chrome://extensions/`, enabling "Developer mode," and clicking "Load unpacked." Select the `dist` directory.
   - Your Chrome extension is now ready for production use!

7. **Additional Configurations:**
   - Ensure you've set up any additional configurations or permissions required for your specific extension features.

## Manifest
```
{
  // Extension Information
  "name": "__MSG_appName__", // Placeholder for localized app name
  "author": "Francesco Vasturzo",
  "version": "1.0.0",
  "manifest_version": 3,

  // Description and Localization
  "description": "__MSG_appDescription__", // Placeholder for localized app description
  "default_locale": "en",

  // Icons for Different Sizes
  "icons": {
    "16": "assets/icons/icon16.png",
    "32": "assets/icons/icon32.png",
    "48": "assets/icons/icon48.png",
    "128": "assets/icons/icon128.png"
  },

  // Content Scripts Configuration
  "content_scripts": [
    {
      "matches": ["http://*/*", "https://*/*"],
      "js": ["content/content.js"],
      "run_at": "document_start"
    }
  ],

  // Background Script Configuration
  "background": {
    "service_worker": "background/background.js"
  },

  // Extension Permissions
  "permissions": ["alarms"],
  "host_permissions": ["http://*/*", "https://*/*"],

  // Options Page Configuration
  "options_page": "settings/settings.html",

  // Browser Action (Popup) Configuration
  "action": {
    "default_title": "popup",
    "default_popup": "popup/popup.html"
  },

  // Web Accessible Resources Configuration
  "web_accessible_resources": [
    {
      "resources": [
        "assets/*",
        "content/*",
        "popup/*",
        "settings/*",
        "background/*",
        "test/*"
      ],
      "matches": ["<all_urls>"]
    }
  ]
}
```

## Author
**Francesco Vasturzo**

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
