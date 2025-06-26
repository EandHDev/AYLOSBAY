# Aylos Bay Hotel Booking System

## Project Overview

This project is a full-stack web application designed to manage hotel room listings and bookings for "Aylos Bay." It leverages the MERN stack (MongoDB, Express.js, React.js, Node.js) to provide a seamless experience for viewing available rooms and facilitating booking requests.

## Technology Stack

*   **Frontend:**
    *   React.js (with React Router DOM for navigation)
    *   Axios (for API requests)
    *   [List any specific UI libraries used, e.g., Bootstrap, Material-UI, Ant Design, or custom CSS]
    *   [List any other significant frontend libraries]

*   **Backend:**
    *   Node.js
    *   Express.js (for building RESTful APIs)
    *   Mongoose (for MongoDB object modeling)
    *   Nodemon (for development server auto-restarts)
    *   [List any other significant backend libraries, e.g., `dotenv`, `bcrypt` (if used for users)]

*   **Database:**
    *   MongoDB

## Key Features Implemented

*   **Room Management:**
    *   Display a list of available hotel rooms with details (e.g., name, price, description, image).
    *   View individual room details.
*   **Booking Functionality:**
    *   [Describe the current state of booking: e.g., "Ability to submit booking requests for rooms," "Basic booking form with date selection."]
    *   [Mention if booking data is saved to the database.]
*   **Responsive Design:**
    *   [Mention if the UI is designed to be responsive across different devices.]

## Installation & Setup

Follow these steps to get the project up and running on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (Node Package Manager, comes with Node.js)
*   MongoDB (running locally or accessible via a cloud service like MongoDB Atlas)

### Steps

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/EandHDev/Hotel_Booking.git
    cd Hotel_Booking
    ```

2.  **Backend Setup:**
    *   Navigate into the backend directory:
        ```bash
        cd backend
        ```
    *   Install backend dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `backend` directory and add your MongoDB connection string:
        ```
        MONGO_URI=[YOUR_MONGODB_CONNECTION_STRING]
        PORT=[YOUR_PORT_NUMBER, e.g., 5000]
        ```
        *(Example MongoDB URI: `mongodb://localhost:27017/aylosbay_db` or your Atlas URI)*
    *   Start the backend server:
        ```bash
        npm start
        ```
        *(The server should start on the specified PORT, e.g., `http://localhost:5000`)*

3.  **Frontend Setup:**
    *   Open a **new terminal window** and navigate into the client directory:
        ```bash
        cd client
        ```
    *   Install frontend dependencies:
        ```bash
        npm install
        ```
    *   Start the frontend development server:
        ```bash
        npm start
        ```
        *(The React app should open in your browser, usually at `http://localhost:3000`)*

## Usage

Once both the backend and frontend servers are running:

1.  Open your web browser and navigate to `http://localhost:3000` (or wherever your React app is served).
2.  You should see the home screen displaying available rooms.
3.  [Describe how to interact with the booking functionality, e.g., "Click on a room to view details and access the booking form."]

## Future Enhancements (Roadmap)

*   **User Authentication & Management:** Implement user registration, login, and profile management.
*   **Payment Gateway Integration:** Integrate with a payment service (e.g., Stripe, PayPal) for secure transactions.
*   **Advanced Room Filtering & Search:** Add more sophisticated filtering options (e.g., by amenities, room type, rating).
*   **Admin Dashboard:** Develop an admin interface for managing rooms, bookings, and users.
*   **Booking Confirmation & Notifications:** Implement email or in-app notifications for booking confirmations.
*   **[Add any other specific features you plan to add or discuss in the interview]**

## Screenshots

*(Optional: Add screenshots of your working application here. A screenshot of the room listing page would be great!)*

---
