# GiftBloom Backend API

A comprehensive Express.js backend for the GiftBloom graduation gift shop, built with clean architecture principles and layered design.

## 🏗️ Architecture

This backend follows Clean Architecture principles with clear separation of concerns:

```
src/
├── domain/           # Business logic and entities
├── application/      # Use cases and services
├── infrastructure/   # Data access and external services
└── presentation/     # Controllers, routes, and middleware
```

## 🚀 Features

- **Products Management**: CRUD operations, search, filtering, categorization
- **Shopping Cart**: Add/remove items, quantity updates, cart persistence
- **Order Processing**: Order creation, status tracking, payment integration ready
- **Contact System**: Message handling, status management, reply system
- **Clean Architecture**: Domain-driven design with proper separation of concerns
- **Security**: Helmet, CORS, rate limiting, input validation
- **Database**: PostgreSQL with Supabase hosting
- **Validation**: Joi schema validation for all endpoints
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone and navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment setup**:

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:

   ```env
   # Database
   DATABASE_URL=your_postgresql_connection_string

   # Server
   PORT=5000
   NODE_ENV=development

   # Frontend
   FRONTEND_URL=http://localhost:5173

   # Security (generate secure secrets)
   JWT_SECRET=your_jwt_secret_key
   API_KEY=your_api_key
   ```

5. **Database setup**:
   ```bash
   # Run the setup script on your PostgreSQL database
   psql $DATABASE_URL -f database/setup.sql
   ```

## 🚦 Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### Products

- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get product by ID or slug
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

**Query Parameters for GET /products:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category
- `search` - Search term
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sortBy` - Sort field (name, price, createdAt)
- `sortOrder` - Sort direction (asc, desc)

#### Cart

- `GET /api/cart/:id` - Get cart by ID
- `POST /api/cart` - Create new cart
- `POST /api/cart/:id/items` - Add item to cart
- `PUT /api/cart/:id/items/:itemId` - Update cart item quantity
- `DELETE /api/cart/:id/items/:itemId` - Remove item from cart
- `DELETE /api/cart/:id` - Clear entire cart

#### Orders

- `GET /api/orders` - Get all orders (with pagination)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `PATCH /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/:id/tracking` - Get order tracking info
- `POST /api/orders/calculate-totals` - Calculate order totals

#### Contact

- `POST /api/contact` - Submit contact message
- `GET /api/contact` - Get all contact messages (admin)
- `GET /api/contact/:id` - Get contact message by ID
- `PATCH /api/contact/:id/status` - Update message status
- `PATCH /api/contact/:id/reply` - Reply to message
- `DELETE /api/contact/:id` - Delete contact message

### Example Requests

#### Create Order

```json
POST /api/orders
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "billingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA"
  },
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "items": [
    {
      "productId": "uuid-here",
      "quantity": 2
    }
  ]
}
```

#### Add Item to Cart

```json
POST /api/cart/:cartId/items
{
  "productId": "uuid-here",
  "quantity": 1
}
```

## 🏛️ Architecture Details

### Domain Layer

- **Entities**: Core business objects (Product, Cart, Order, etc.)
- **Use Cases**: Business logic operations
- **Repository Interfaces**: Abstract data access contracts

### Application Layer

- **Services**: Orchestrate business operations
- **DTOs**: Data transfer objects for API communication

### Infrastructure Layer

- **Repositories**: Concrete data access implementations
- **Database**: PostgreSQL connection and queries
- **External Services**: Third-party integrations

### Presentation Layer

- **Controllers**: Handle HTTP requests/responses
- **Routes**: API endpoint definitions
- **Middleware**: Validation, authentication, error handling

## 🗄️ Database Schema

The database includes the following main tables:

- `categories` - Product categories
- `products` - Product catalog
- `users` - User accounts
- `carts` - Shopping carts
- `cart_items` - Cart line items
- `orders` - Customer orders
- `order_items` - Order line items
- `contact_messages` - Contact form submissions
- `reviews` - Product reviews

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: Joi schema validation
- **Error Handling**: Secure error responses
- **Environment Variables**: Sensitive data protection

## 🧪 Testing

```bash
npm test
```

## 📝 Environment Variables

| Variable       | Description                  | Default               |
| -------------- | ---------------------------- | --------------------- |
| `DATABASE_URL` | PostgreSQL connection string | Required              |
| `PORT`         | Server port                  | 5000                  |
| `NODE_ENV`     | Environment mode             | development           |
| `FRONTEND_URL` | Frontend application URL     | http://localhost:5173 |
| `JWT_SECRET`   | JWT signing secret           | Required              |
| `API_KEY`      | API authentication key       | Required              |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.
