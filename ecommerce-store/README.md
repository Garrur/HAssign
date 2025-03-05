# E-commerce Store with Discount System

This project implements an e-commerce store with cart functionality, checkout process, and a discount code system. Every nth order (currently set to 3) automatically generates a discount code that can be applied to future purchases.

## Development Process

### 1. Initial Setup and Planning
- Set up React + TypeScript project with Vite
- Planned the application architecture and component structure
- Defined core types and interfaces for the domain model
- Established the in-memory data store structure

### 2. Core API Implementation
- Created base product catalog with sample data
- Implemented cart management functions:
  - Add to cart
  - Update quantities
  - Remove items
  - Clear cart
- Added discount code generation and validation
- Developed checkout process with discount handling

### 3. State Management
- Implemented CartContext for global cart state
- Added hooks for cart operations
- Integrated discount code validation
- Set up order processing logic

### 4. UI Development
- Created reusable components:
  - ProductCard for product display
  - CartItem for cart management
  - Navbar for navigation
- Implemented main pages:
  - Products listing
  - Shopping cart
  - Order confirmation
  - Admin dashboard


## Features

- **Product Browsing**: View and browse available products
- **Shopping Cart**: Add, update, and remove items from your cart
- **Checkout Process**: Complete purchases with optional discount codes
- **Discount System**: Every nth order generates a discount code
- **Admin Dashboard**: View sales statistics and manage discount codes

## Technical Implementation

### Frontend
- React with TypeScript
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Lucide React for icons

### Backend (In-memory)
- RESTful API service
- In-memory data store for products, cart, orders, and discount codes
- Discount code generation and validation

## Architecture

### Data Flow
1. User interacts with UI components
2. Components dispatch actions through CartContext
3. Actions call API service functions
4. API services update in-memory store
5. State changes trigger UI updates

### State Management
- CartContext manages global cart state
- API services handle data persistence
- React Router manages navigation state
- Component-level state for UI interactions

## API Endpoints

### Product APIs
- `getProducts()`: Get all available products
- `getProductById(id)`: Get a specific product by ID

### Cart APIs
- `getCart()`: Get the current cart contents
- `addToCart(productId, quantity)`: Add a product to the cart
- `updateCartItemQuantity(productId, quantity)`: Update the quantity of a cart item
- `removeFromCart(productId)`: Remove an item from the cart
- `clearCart()`: Empty the cart

### Checkout APIs
- `validateDiscountCode(code)`: Check if a discount code is valid
- `checkout(discountCode?)`: Process the checkout with an optional discount code

### Admin APIs
- `getAdminStats()`: Get statistics about orders, items sold, and discounts
- `adminGenerateDiscountCode()`: Manually generate a new discount code



## Design Decisions

### In-Memory Storage
- Chose in-memory storage for simplicity and demo purposes
- Structured data with TypeScript interfaces for type safety
- Implemented promise-based API for future database integration

### Discount System
- Every 3rd order generates a discount code
- 10% discount on cart total
- Single-use codes for better tracking
- Admin can generate additional codes

### UI/UX Considerations
- Responsive design for all screen sizes
- Loading states for async operations
- Error handling with user feedback
- Clear navigation structure

## How to Use

1. **Browse Products**: View the available products on the home page
2. **Add to Cart**: Click "Add to Cart" on any product to add it to your shopping cart
3. **Manage Cart**: View your cart, update quantities, or remove items
4. **Apply Discount**: Enter a discount code if you have one
5. **Checkout**: Complete your purchase
6. **Admin Dashboard**: Access the admin dashboard to view sales statistics and manage discount codes

## Discount System Logic

- Every 3rd order automatically generates a new discount code
- Discount codes provide a 10% discount on the cart total
- Each discount code can only be used once
- Admin can manually generate additional discount codes if needed

## Future Improvements

### Short Term
- Add user authentication
- Implement persistent storage
- Add product categories
- Enhance search functionality

### Medium Term
- User account management
- Order history
- Enhanced admin features
- Product inventory management

### Long Term
- Multiple discount types
- Advanced analytics
- Customer loyalty program
- Integration with payment gateways

## Code Organization

```
src/
├── components/          # Reusable UI components
├── context/            # Global state management
├── pages/              # Route components
├── services/           # API and business logic
├── types/              # TypeScript interfaces

```

## Best Practices Implemented

1. **Type Safety**
   - TypeScript for static typing
   - Interface definitions for data structures
   - Type checking in components

2. **Code Organization**
   - Modular component structure
   - Separation of concerns
   - Clear file organization



3. **Error Handling**
   - Graceful error recovery
   - User-friendly error messages
   - Consistent error patterns

4. **Performance**
   - Efficient state updates
   - Optimized re-renders
   - Lazy loading where appropriate