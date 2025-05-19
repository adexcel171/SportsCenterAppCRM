
SportsCenterApp Documentation
Overview
SportsCenterApp is a robust web application designed for sports and fitness centers to manage user data, subscriptions, and payments. The application provides a seamless backend powered by Node.js, Express, and MongoDB, integrated with Paystack for secure payment processing. The frontend (assumed to be built with a modern framework like React) offers an intuitive interface for administrators and users to interact with features such as user profile management, subscription tracking, and data filtering (e.g., users with birthdays today or expired subscriptions).
The app supports both administrative and user roles, with secure authentication, role-based access control, and automated subscription reminders. It is designed to streamline operations for fitness centers, ensuring efficient management of user information, financial transactions, and subscription renewals.
Table of Contents

Features
Architecture
Backend Details
Models
Controllers
Routes
Middleware


Frontend Overview
Payment Integration
Filtering and Search
Setup and Installation
Usage
API Endpoints
Future Enhancements
Contributing
License

Features

User Management: Create, update, and delete user profiles with details like name, email, age, birthday, and contact information.
Subscription Management: Manage subscription plans (weekly, monthly, yearly), track start/end dates, and cancel subscriptions.
Payment Processing: Secure payments via Paystack with verification of transactions.
Data Filtering: Filter users by criteria such as birthdays today, expired subscriptions, or custom search by name.
Subscription Reminders: Automated email reminders for users with subscriptions expiring within 7 days.
Role-Based Access: Admins can manage categories, users, and subscriptions, while users can view their profiles and subscriptions.
Search and Pagination: Efficiently search user data and paginate results for better usability.
Secure Authentication: JWT-based authentication with password hashing using bcrypt.

Architecture
The application follows a Model-View-Controller (MVC) pattern:

Models: Define MongoDB schemas for users, user data, subscriptions, and categories.
Controllers: Handle business logic for CRUD operations, payment processing, and email reminders.
Routes: Define API endpoints for accessing resources, protected by authentication middleware.
Middleware: Includes async error handling, authentication, and admin authorization.
Frontend: A presumed client-side interface (e.g., React) communicates with the backend via RESTful APIs.

The backend uses Express.js for routing, Mongoose for MongoDB interactions, and Paystack for payment processing. The frontend is assumed to provide a responsive UI for both admins and users.
Backend Details
Models
The application defines the following Mongoose models:

User (userModel.js):
Fields: username, email, password (hashed), isAdmin.
Purpose: Manages user authentication and roles.


UserData (userdataModel.js):
Fields: name, number, email, credit, debit, note, date, subscription, subscriptionEndDate, lastReminderSent.
Methods: isSubscriptionExpiringSoon to check if a subscription is nearing expiry.
Purpose: Stores detailed user information, including financial and subscription data.


Subscription (subscriptionModel.js):
Fields: user, email, name, plan, amount, duration, startDate, endDate, status, paymentReference, paymentType.
Purpose: Tracks subscription details and payment status.


Category (categoryModel.js):
Fields: name.
Purpose: Categorizes services or plans (e.g., yoga, gym, cardio).



Controllers
The controllers handle the core logic:

userController.js:
Manages user registration, login, logout, profile updates, and admin operations (e.g., deleting users).
Uses bcrypt for password hashing and JWT for token-based authentication.


userdataController.js:
Handles CRUD operations for user data, including adding, updating, deleting, and fetching user records.
Supports search by name, pagination, and subscription reminders via email.


subscriptionController.js:
Manages subscription creation, retrieval, and cancellation.
Integrates with Paystack to verify payments before creating subscriptions.


categoryController.js:
Manages categories for organizing services or plans (create, update, delete, list).



Routes
The application exposes RESTful API endpoints, organized by resource:

userRoutes.js:
/: Create user (POST), get all users (GET, admin).
/auth: Login (POST).
/logout: Logout (POST).
/profile: Get/update user profile (GET/PUT, authenticated).
/:id: Admin operations (GET/PUT/DELETE).


userdataRoutes.js:
/: Get paginated user data (GET), add user data (POST).
/alluserdata: Get all user data (GET, limited to 500 records).
/:id: Get/update/delete user data by ID (GET/PUT/DELETE).
/:id/remind: Send subscription reminder (POST, authenticated).


subscriptionRoutes.js:
/: Create subscription (POST, authenticated).
/my-subscriptions: Get user’s subscriptions (GET, authenticated).
/all: Get all active subscriptions (GET, public).
/cancel/:id: Cancel subscription (PUT, authenticated).


categoryRoutes.js:
/: Create category (POST, admin).
/categories: List all categories (GET, public).
/:id: Get category by ID (GET, public).
/:categoryId: Update/delete category (PUT/DELETE, admin).



Middleware

asyncHandler.js: Wraps async route handlers to catch and handle errors gracefully.
authMiddleware.js:
authenticate: Verifies JWT tokens to ensure user authentication.
authorizeAdmin: Restricts access to admin-only routes.



Frontend Overview
While the frontend code is not provided, it is assumed to be a modern single-page application (e.g., built with React or Vue.js) that interacts with the backend via RESTful APIs. Key frontend features likely include:

User dashboard for viewing profiles and subscriptions.
Admin panel for managing users, subscriptions, and categories.
Forms for adding/editing user data and subscriptions.
Filtering options (e.g., users with birthdays today, expired subscriptions).
Responsive design for mobile and desktop access.

The frontend communicates with the backend using HTTP requests (e.g., Axios or Fetch) and handles authentication by storing JWT tokens in cookies or local storage.
Payment Integration
The application integrates Paystack for secure payment processing:

Process: When a user initiates a subscription, the frontend sends a payment reference to the backend.
Verification: The verifyPayment function in paystack.js checks the payment status with Paystack’s API.
Subscription Creation: If the payment is successful, a new subscription is created with details like plan, amount, duration, and end date.
Security: Payment references are validated to prevent duplicate or fraudulent transactions.

Filtering and Search
The app provides robust filtering and search capabilities:

Search: Users can search for user data by name using a case-insensitive regex (userdataController.js: fetchUserData).
Pagination: Results are paginated with configurable page size and sorting by creation date.
Custom Filters:
Birthdays Today: The frontend can query user data by date field (assumed to store birthdates) to display users with birthdays on the current day.
Expired Subscriptions: The isSubscriptionExpiringSoon method or a custom query can identify users with expired or soon-to-expire subscriptions (subscriptionEndDate <= current date).



Setup and Installation
Prerequisites

Node.js (v16 or higher)
MongoDB (local or cloud, e.g., MongoDB Atlas)
Paystack account (API keys for payment integration)
Environment variables:
MONGO_URI: MongoDB connection string
JWT_SECRET: Secret for JWT token signing
PAYSTACK_SECRET_KEY: Paystack API key
NODE_ENV: Environment (e.g., development, production)



Installation

Clone the Repository:git clone https://github.com/yourusername/sportscenterapp.git
cd sportscenterapp


Install Dependencies:npm install


Set Up Environment Variables:Create a .env file in the root directory:MONGO_URI=mongodb://localhost:27017/sportscenter
JWT_SECRET=your_jwt_secret
PAYSTACK_SECRET_KEY=sk_test_your_paystack_key
NODE_ENV=development


Run the Backend:npm start


Frontend Setup (assumed):
Navigate to the frontend directory (e.g., client/).
Install dependencies (npm install).
Start the frontend (npm start).


Access the App:
Backend: http://localhost:5000 (or configured port)
Frontend: http://localhost:3000 (or configured port)



Usage

User Registration/Login:
Register via /api/users/ (POST) or log in via /api/users/auth (POST).
Receive a JWT token for authenticated requests.


Manage User Data:
Admins can add user data via /api/userdata/ (POST) with fields like name, email, subscription, and birthdate.
Update or delete user data via /api/userdata/:id (PUT/DELETE).


Subscriptions:
Create subscriptions via /api/subscriptions/ (POST) after Paystack payment.
View subscriptions via /api/subscriptions/my-subscriptions (GET).
Cancel subscriptions via /api/subscriptions/cancel/:id (PUT).


Filtering:
Use the frontend to filter users by birthday or subscription status.
Search users by name via /api/userdata/?keyword=query (GET).


Admin Tasks:
Manage categories via /api/categories/ (POST/GET/PUT/DELETE).
Send subscription reminders via /api/userdata/:id/remind (POST).



API Endpoints
Below is a summary of key API endpoints:



Method
Endpoint
Description
Authentication



POST
/api/users/
Create a new user
None


POST
/api/users/auth
User login
None


GET
/api/users/profile
Get user profile
Authenticated


POST
/api/userdata/
Add user data
None


GET
/api/userdata/
Fetch paginated user data
None


PUT
/api/userdata/:id
Update user data
None


DELETE
/api/userdata/:id
Delete user data
Authenticated, Admin


POST
/api/userdata/:id/remind
Send subscription reminder
Authenticated


POST
/api/subscriptions/
Create subscription
Authenticated


GET
/api/subscriptions/my-subscriptions
Get user’s subscriptions
Authenticated


PUT
/api/subscriptions/cancel/:id
Cancel subscription
Authenticated


POST
/api/categories/
Create category
Authenticated, Admin


GET
/api/categories/categories
List all categories
None


For a complete list, refer to the route files (userRoutes.js, userdataRoutes.js, subscriptionRoutes.js, categoryRoutes.js).
Future Enhancements

Advanced Filtering: Add more filter options (e.g., age range, subscription type).
Analytics Dashboard: Provide admins with insights into user activity and revenue.
Multi-Language Support: Localize the frontend for broader accessibility.
Mobile App: Develop iOS/Android apps for user convenience.
Automated Renewal: Integrate Paystack’s subscription API for automatic renewals.
Notification System: Add SMS or push notifications for reminders.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

Please follow the code style and include tests for new features.
License
This project is licensed under the MIT License. See the LICENSE file for details.

