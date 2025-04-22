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
- [Long-term Solutions](#long-term-solutions-for-performance)
- [Current Limitations](#current-limitations)
- [Conclusion](#conclusion-from-phase2)


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
- **Data Visualization**: Charts and graphs for expense analysis
- **Theme Customization**: Allow users to personalize dashboard appearance
- **Budget Planning**: Set budget goals and track progress
- **Receipt Scanning**: OCR for automatic expense entry
- **Recurring Expenses**: Support for scheduled recurring expenses
- **Export Functionality**: Export expense data to CSV/PDF
- **Dark Mode**: Toggle between light and dark themes
- **Multi-language Support**: Internationalization for global users
- **Mobile App**: Native mobile applications using React Native

## Long-term Solutions for Performance
- **Upgrade to Firebase Blaze Plan**: I'm considering upgrading to the pay-as-you-go plan since it offers better performance and higher limits. It still has a generous free tier that would keep my costs minimal while the application grows.
- **Implement a Backend Proxy**: One solution I'm exploring is creating a simple backend service to handle Firebase operations and implement caching. This would reduce direct Firestore calls and improve response times for my users.
- **Use Firebase Emulator for Development**: I plan to start using the Firebase Emulator for development work. This would let me work offline and speed up my development process without being dependent on network conditions.
- **Implement Data Pagination**: To improve initial load times, especially for users who track many expenses, I'll implement data pagination to load information in smaller, more manageable chunks.
- **Optimize Firestore Queries**: I need to restructure my data and queries to minimize read operations. This should significantly improve performance and reduce the likelihood of hitting rate limits on the free tier.

## Current Limitations
- One thing I ran into during development was performance issues because of Firebase's free Spark plan. Sometimes the app feels a bit slow, especially when saving or fetching expenses. This mainly happens because:

1. The free tier has tighter rate limits and fewer concurrent connections

2. There’s no dedicated infrastructure like you’d get with the paid plans

3, Cold starts can happen if the service hasn’t been used in a while

- Upgrading to a custom backend would definitely help with these issues, but it wasn’t realistic for the scope and timeframe of this project. Building out full backend functionality—auth, database setup, APIs, etc.—would’ve taken quite a bit more time.

- That said, these limitations don’t affect the core features or the learning goals of the app. It’s a good example of the kind of trade-offs developers often have to make between time, budget, and performance in real-world projects.

## Conclusion (From Phase2)
Developing this project enhanced my understanding of modern web development tools and frameworks. Having primarily focused on graphic and UI/UX design in my professional career in, where I typically collaborated with specialized teams, this project represented my first substantial venture into full-stack development on my own.

The journey from concept to implementation allowed me to bridge the gap between design and development, giving me valuable insights into the entire web application lifecycle. Working with Next.js, Firebase, and TypeScript pushed me beyond my comfort zone, challenging me to think not just as a designer but as a developer who must consider performance, security, and user experience as a complete package. (Also helping me to understand the frustrations of my devs when I'm doing mind boggling designs)

Working independently on this project provided a refreshing perspective compared to my usual team-based approach. In my previous roles, I handled client-facing responsibilities and design work while developers managed the technical implementation. This experience has given me a deeper appreciation for the complexities of bringing a design to life through code, and I'm now starting to feel more confident in my ability to communicate effectively with development teams once again.