# Basketballshop Website

Welcome to the Basketballshop GitHub repository. This document provides instructions on how to set up and host the Basketballshop website professionally.

## About the Project  
The Basketballshop website is a **side project** developed to explore how an online store for basketball shoes could be designed and hosted. It demonstrates the basics of building an e-commerce style website, focusing on product presentation, smooth navigation, and professional deployment. While not a full-scale business platform, this project serves as a practical exercise in modern web development and hosting practices.

## Prerequisites
Before you begin, ensure that you have the following prerequisites installed on your system:
* [Node.js](https://nodejs.org/)
* [ngrok](https://ngrok.com/)

## Hosting Instructions
Follow these steps to host the Basketballshop website:

### Step 1: Configuring ngrok
1. Open your terminal and navigate to the folder where you extracted the ngrok executable. For example:
   ```bash
   cd C:\Users\YourUsername\Downloads\ngrok-v3-stable-windows-amd64
   ```
2. Add your ngrok authtoken by running the following command. Replace `::_INSERT KEY_` with your actual ngrok authtoken, which you can obtain by creating an ngrok account and locating it in the "Connect to your account" section.
   ```bash
   .\ngrok authtoken ::_INSERT KEY_
   ```
3. Next, set up port forwarding to expose your local web server on port 8080 using the following command:
   ```bash
   .\ngrok http 8080
   ```

### Step 2: Setting up the Basketballshop Website
1. Open Visual Studio Code (VSCode) and go to the terminal.
2. Install the necessary Node.js packages by running the following command:
   ```bash
   npm install
   ```
3. After the installation is complete, run the website by executing the following command:
   ```bash
   npm start
   ```

### Access the Website
Once you've completed the above steps, you will see a forwarding link similar to the example below in your terminal:

```
Forwarding https://your-unique-subdomain.ngrok.io -> http://localhost:8080
```

To access the Basketballshop website, follow the provided hyperlink that concludes with "ngrok.io."

Your Basketballshop website is now professionally hosted and accessible through the provided link. Enjoy exploring the basketball-related content!
