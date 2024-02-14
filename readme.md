# Shoppio - Your One-Stop E-Commerce Platform 🛍️

<p align="center">
  <img alt="Mongo" src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img alt="Node.js" src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
</p>


Shoppio is a full-featured e-commerce platform that empowers both customers and vendors. Customers can conveniently browse and purchase products from a wide range of vendors, personalize their profiles, and enjoy secure payments. Vendors can expand their reach, manage their products and orders, and track performance effortlessly.

## Table of Contents
- [Getting Started](#getting-started-)
- [Features](#features-)
- [Project Structure](#project-structure-)
- [Client](#client)
- [Server](#server)
- [License](#license-)

## Getting Started 🚀

1. Clone the repository.
2. Navigate to the client and server folders separately and run `npm install` to install dependencies.
3. Set up your database and update connection details in `server/db/connect.js`.
4. Create a `.env` file in the server folder and add necessary environment variables.
5. Run the both server and client with `npm start` in the server folder.

## Features 🌟

- **User Features:**
  - Browse products conveniently.
  - Create a personalized profile.
  - Secure payments and checkout process.
  - Track orders and manage wishlists.

- **Vendor Features:**
  - Expand business reach.
  - Easily add and manage products.
  - Monitor order and sales statistics.

## Project Structure 📂

### Client
The client-side code is organized as follows:

- **src/assets:** Contains images used in the project.
- **src/wrappers:** Includes wrapper components, such as the Landing page.
- **src/components:** Houses various components categorized under `site`, `user`, and `vendor`.
- **src/context:** Manages global state using React Context API.
- **src/pages:** Defines different pages of the application.
- **src/utils:** Includes utility functions used across the application.
- **src/App.js:** The main entry point for the client-side application.

### Server
The server-side code is structured as follows:

- **server/controllers:** Handles business logic for authentication, customer, site, and vendor functionalities.
- **server/db:** Manages database connection.
- **server/errors:** Custom error classes.
- **server/middleware:** Contains middleware functions, such as authentication and error handling.
- **server/models:** Defines database models for Notification, Order, Product, ProductReview, User, and WishList.
- **server/routers:** Routes for authentication and different user roles.
- **server/.env:** Environment variables for the server.
- **server/server.js:** Main entry point for the server.

## Screenshots

| Home | Shop | Product-Details |
|----------|----------|----------|
| ![Home](images/home.jpeg) | ![Shop](images/shop.jpeg) | ![Product-Details](images/product-details.jpeg) |
| Cart | My Orders (Customer) | Track Order |
| ![Cart](images/cart.jpeg) | ![My Orders (Customer)](images/customer-my-orders.jpeg) | ![Track Order](images/track-order.jpeg) |
| Wishlist | Vendor Dashboard | Create Product (Vendor) |
| ![Wishlist](images/wishlist.jpeg) | ![Vendor Dashboard](images/vendor-dashboard.jpeg) | ![Create Product (Vendor)](images/vendor-create-product.jpeg) |
| Vendor Orders | Vendor's Page For Customers | Vendor Profile |
| ![Vendor Orders](images/vendor-orders.jpeg) | ![Vendor's Page For Customers](images/vendor-page.jpeg) | ![Vendor Profile](images/vendor-profile.jpeg) |


## License 📄

This project is licensed under the [MIT License](LICENSE).
