# 🚌 Bus Booking System — Spring Boot + MySQL

A complete REST API for an online bus booking system using **Spring Boot**, **MySQL**, and **Session-based authentication** (no JWT).

---

## 🗂️ Project Structure

```
src/main/java/com/busbooking/
├── BusBookingApplication.java
├── config/
│   ├── AuthInterceptor.java       ← Checks if user is logged in
│   ├── AdminInterceptor.java      ← Checks if user is ADMIN
│   ├── WebConfig.java             ← Registers interceptors on routes
│   ├── GlobalExceptionHandler.java
│   └── DataInitializer.java       ← Seeds default admin on startup
├── controller/
│   ├── UserController.java        ← register, login, logout, profile
│   ├── AdminBusController.java    ← add, update, delete, get buses
│   ├── SearchController.java      ← search buses by from/to
│   └── BookingController.java     ← book, cancel, ticket, my-bookings
├── dto/
│   ├── ApiResponse.java
│   ├── UserRegistrationRequest.java
│   ├── LoginRequest.java
│   ├── UserResponse.java
│   ├── BusRequest.java
│   ├── BusSearchResponse.java
│   ├── BookingRequest.java
│   └── TicketResponse.java
├── entity/
│   ├── User.java
│   ├── Bus.java
│   └── Booking.java
├── enums/
│   ├── Role.java                  ← USER, ADMIN
│   └── BookingStatus.java         ← CONFIRMED, CANCELLED
├── repository/
│   ├── UserRepository.java
│   ├── BusRepository.java
│   └── BookingRepository.java
└── service/
    ├── UserService.java
    ├── BusService.java
    ├── SearchService.java
    └── BookingService.java
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.x running locally

### 2. Database Setup
MySQL database will be **auto-created** on first run. Just make sure MySQL is running.

Update credentials in `src/main/resources/application.properties` if needed:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bus_booking_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```

### 3. Run the Application
```bash
cd bus-booking-system
mvn spring-boot:run
```

### 4. Default Admin Account (auto-created on startup)
```
Username : admin
Password : admin123
```

---

## 🔐 Authentication (Session-based)

- Login stores user data in an **HttpSession** (no JWT)
- Session expires after **30 minutes** of inactivity
- All protected routes checked via interceptors

| Route Pattern         | Access Level         |
|-----------------------|----------------------|
| `/api/users/register` | Public               |
| `/api/users/login`    | Public               |
| `/api/users/logout`   | Logged-in users      |
| `/api/users/profile`  | Logged-in users      |
| `/api/search/**`      | Logged-in users      |
| `/api/bookings/**`    | Logged-in users      |
| `/api/admin/**`       | ADMIN only           |

---

## 📋 API Reference

### 👤 User Module

#### Register
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "pass123",
  "phoneNumber": "9876543210"
}
```

#### Login
```
POST /api/users/login
Content-Type: application/json

{
  "name": "John Doe",
  "password": "pass123"
}
```

#### Logout
```
POST /api/users/logout
```

#### Profile
```
GET /api/users/profile
```

---

### 🚌 Bus Module (Admin Only)

#### Add Bus
```
POST /api/admin/buses
Content-Type: application/json

{
  "busNumber": "AP-12",
  "busName": "Vijay Travels",
  "source": "Hyderabad",
  "destination": "Chennai",
  "departureTime": "08:00",
  "arrivalTime": "16:00",
  "availableSeats": 40,
  "fare": 850.0
}
```

#### Update Bus
```
PUT /api/admin/buses/{id}
Content-Type: application/json
(same body as Add Bus)
```

#### Delete Bus
```
DELETE /api/admin/buses/{id}
```

#### Get All Buses
```
GET /api/admin/buses
```

#### Get Bus by ID
```
GET /api/admin/buses/{id}
```

---

### 🔍 Search Module

#### Search Buses (by From & To)
```
GET /api/search/buses?from=Hyderabad&to=Chennai
```

**Response includes:**
- Bus Number, Bus Name
- Departure Time, Arrival Time
- Available Seats
- Fare

---

### 🎫 Booking Module

#### Book a Seat
```
POST /api/bookings/book
Content-Type: application/json

{
  "busId": 1,
  "passengerName": "John Doe",
  "journeyDate": "2025-12-25"
}
```

**Ticket Response includes:**
- Ticket Number
- Passenger Name
- Bus Number
- Seat Number
- Journey Date
- From → To
- Departure & Arrival Time
- Fare
- Status (CONFIRMED / CANCELLED)
- Booked At

#### Cancel Booking
```
POST /api/bookings/cancel/{ticketNumber}
```
- Cancels the ticket
- Available seats are automatically restored

#### View Ticket
```
GET /api/bookings/ticket/{ticketNumber}
```

#### My Bookings
```
GET /api/bookings/my-bookings
```
Returns all bookings (confirmed + cancelled) for the logged-in user.

---

## 📝 Notes

- **Passwords** are stored as plain text in this demo. In production, use `BCryptPasswordEncoder`.
- **Seat numbers** are auto-assigned sequentially per bus.
- The `journeyDate` must be today or a future date.
- Session is shared via cookies (JSESSIONID). Use Postman with "Cookie jar" enabled.

---

## 🧪 Postman Testing Tips

1. Enable **"Cookie jar"** in Postman → the JSESSIONID cookie is stored automatically after login.
2. All subsequent requests automatically send the session cookie.
3. Test admin routes by logging in as `admin / admin123`.
