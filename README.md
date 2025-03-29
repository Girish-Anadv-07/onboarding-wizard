# Custom Onboarding Flow 🧭

This project is a full-stack onboarding wizard application. It allows users to complete a multi-step onboarding flow, and provides a customizable admin interface for managing the input components on each onboarding page. User submissions are viewable in a live data table.

## 🧱 Tech Stack

- **Frontend:** React.js
- **Database:** Firebase Firestore
- **Languages:** JavaScript, HTML, CSS

---

## ✨ Features

### 👤 User Onboarding (`/`)

- Multi-step "wizard" flow with step indicators
- Email and password form
- Custom pages with dynamic components:
  - "About Me" textarea
  - Address form (street, city, state, zip)
  - Birthdate picker
- Form state persists between sessions if email/password were submitted
- Field validation for required inputs

### 🛠️ Admin Section (`/admin`)

- Add/Edit/Delete/Customise pages and fields
- Save onboarding structure to Firestore

### 📊 Data Table (`/data`)

- Displays submitted user data

---
