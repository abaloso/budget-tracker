# BudGo | Seamless Saving, Effortless Tracking.

Welcome to BudGo! This is a modern budget tracking application built with Next.js and Firebase. My goal with BudGo is to helps users track personal and group expenses, providing a seamless experience for managing finances. 

This application features user authentication, expense tracking, and a responsive design that works across all devices. (Expense Tracking is still ongoing!)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [Future Enhancements](#future-enhancements)
- [Conclusion](#conclusion)

## Overview

The goal of this app is to simplify expense tracking with an intuitive interface. Users can create accounts, log in securely, and manage both personal and group expenses. The application provides a dashboard with expense summaries and allows users to add, categorize, and filter expenses.

## Features

- **User Authentication**: Secure sign-up, login, and password reset functionality
- **Dashboard**: Overview of expenses with summary cards
- **Expense Management**: Add, view, and categorize expenses
- **Expense Types**: Support for both personal and group expenses
- **Responsive Design**: Mobile-first approach that works on all devices
- **Profile Management**: User profile editing and password changes
- **Secure Data Storage**: Firebase Firestore for secure data management

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Deployment**: Vercel
- **State Management**: React Hooks
- **Icons**: Lucide React

## Setup and Installation

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Firebase account

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/abaloso/budget-tracker.git
   cd budget-tracker

2. **Install Dependencies**
    npm install
    or
    yarn install

3. Setup Firebase
    - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
    - Enable Authentication (Email/Password)
    - Create a Firestore database
    - Get your Firebase configuration (API keys, etc.)

## Environment Variables
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
**Important**: Never commit your `.env.local` file to version control.

## Running Locally
    After setting up the environment variables, you can run the development server:
    npm run dev
    or
    yarn dev
    Open [http://localhost:3000] in your browser to see the application.

## Deployment
The application is configured for easy deployment on Vercel:
1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Add the environment variables in Vercel's project settings
4. Deploy

## Security Considerations
- Firebase API keys are client-side keys and are meant to be public, but they should still be managed through environment variables
- Firestore security rules should be properly configured to restrict data access
- User authentication is handled securely through Firebase Authentication
- Sensitive operations should be protected with proper authorization checks

## Future Enhancements
- Expense analytics and reporting
- Budget planning features
- Receipt scanning and OCR
- Recurring expenses
- Export functionality for expense data
- Dark mode support
- Multi-language support

## Conclusion
Developing this project enhanced my understanding of modern web development tools and frameworks. Having primarily focused on graphic and UI/UX design in my professional career in, where I typically collaborated with specialized teams, this project represented my first substantial venture into full-stack development on my own.

The journey from concept to implementation allowed me to bridge the gap between design and development, giving me valuable insights into the entire web application lifecycle. Working with Next.js, Firebase, and TypeScript pushed me beyond my comfort zone, challenging me to think not just as a designer but as a developer who must consider performance, security, and user experience as a complete package. (Also helping me to understand the frustrations of my devs when I'm doing mind boggling designs)

Working independently on this project provided a refreshing perspective compared to my usual team-based approach. In my previous roles, I handled client-facing responsibilities and design work while developers managed the technical implementation. This experience has given me a deeper appreciation for the complexities of bringing a design to life through code, and I'm now starting to feel more confident in my ability to communicate effectively with development teams once again.

**PS:**
While functional in its current state, most important features are still just placehoders. I plan to implement more working features in the final phase of the project. The knowledge I've gained through this project has positioned me well to continue expanding the application's capabilities and potentially commercialize the product in the future.