# Inventory Management System for Indian Material Businesses
## Problem-Solving Document & Implementation Report

---

## Part 1: Problem Analysis & Solutions

### Problem Statement
Indian material businesses face critical inventory management challenges: low net margins from dead inventory and poor-performing SKUs, damaged inventory going unnoticed, lack of visibility over inventory levels across stores, and low confidence in scaling operations.

### Proposed Solutions

**1. Real-Time Inventory Visibility (Tech Solution)**
- **Problem**: No visibility over inventory levels across multiple stores
- **Solution**: Centralized inventory management system providing real-time stock visibility for manufacturers (across all stores) and store owners (individual stores)
- **Benefits**: Immediate stock awareness, quick identification of over/understocked items, better restocking decisions

**2. Automated Inventory Tracking (Tech Solution)**
- **Problem**: Manual tracking leads to errors and delays
- **Solution**: Digital system automatically updating inventory when products are added/sold, maintaining initial and current quantity records
- **Benefits**: Eliminates calculation errors, real-time updates prevent discrepancies, historical tracking for analysis

**3. Multi-Store Management (Tech Solution)**
- **Problem**: Difficulty managing multiple store locations
- **Solution**: Role-based access control where manufacturers create/manage stores, while store owners manage individual inventory
- **Benefits**: Centralized control, delegated management, scalable architecture

**4. Product Catalog Management (Tech Solution)**
- **Problem**: Inconsistent product information across stores
- **Solution**: Centralized product catalog ensuring all stores access the same product database
- **Benefits**: Standardized information, easy product addition, consistent SKU management

**5. Inventory Analytics Foundation (Tech Solution)**
- **Problem**: No data for identifying poor-performing SKUs
- **Solution**: System tracks initial and current quantities, providing foundation for future analytics to identify dead inventory
- **Benefits**: Data collection for analytics, inventory turnover pattern identification, data-driven decisions

---

## Part 2: Implementation

### Technical Stack
- **Frontend**: Next.js 16.1.1 (React 19.2.3)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **UI**: Radix UI with Tailwind CSS
- **Validation**: React Hook Form with Zod

### System Architecture
```
Next.js App (Frontend + API Routes)
    ├── Authentication (NextAuth)
    ├── Role-Based Access Control
    │   ├── Manufacturer Role
    │   └── Store Role
    └── Database Layer (Prisma)
        ├── Users
        ├── Products
        ├── Stores
        └── StoreInventory
```

### Key Features Implemented

**1. User Authentication & Authorization**
- Google OAuth integration, role-based access control (Manufacturer/Store), session management

**2. Manufacturer Dashboard**
- Product Management: Create and view all products
- Store Management: Create stores and assign store owners
- Inventory Overview: View inventory across all stores
- Multi-Store Visibility: Monitor all stores from single dashboard

**3. Store Owner Dashboard**
- Inventory Management: Add products with quantities
- Stock Updates: Increase inventory quantities
- Inventory Viewing: View stock levels (initial and current quantities)
- Product Selection: Choose from manufacturer's product catalog

**4. Inventory Tracking System**
- Tracks `initialQuantity` and `currentQuantity` per product-store combination
- Automatic updates on inventory changes
- Unique constraint prevents duplicate entries
- Timestamp tracking for audit trails

**5. Data Models**
- **User**: Manufacturer and store roles with relationships
- **Product**: Centralized product catalog
- **Store**: Store information linked to manufacturer
- **StoreInventory**: Junction table tracking inventory per store-product pair

### API Endpoints

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/[...nextauth]` | GET/POST | Authentication | Public |
| `/api/user/current` | GET | Get current user info | Authenticated |
| `/api/Products/add` | POST | Add new product | Manufacturer |
| `/api/Products/GET` | GET | Get all products | Authenticated |
| `/api/Stores/create` | POST | Create new store | Manufacturer |
| `/api/Stores/GET` | GET | Get all stores | Manufacturer |
| `/api/Stores/inventory/add` | POST | Add to inventory | Store Owner |
| `/api/Stores/inventory/decrease` | POST | Decrease inventory | Store Owner |
| `/api/Stores/inventory/GET` | GET | Get store inventory | Store Owner |

### Security Features
- Session-based authentication, role-based authorization on all API routes, input validation, SQL injection prevention via Prisma ORM, email uniqueness constraints

### User Interface
- Responsive design (mobile/desktop), real-time form validation, loading states and error handling, success/error notifications, modern UI with Tailwind CSS

---

## Assumptions Made

1. **User Registration**: Users pre-registered or created automatically when stores assigned. Store owner emails known to manufacturers.
2. **Inventory Decrease**: Decrease functionality implemented; sales/usage tracking integrated separately or handled manually.
3. **Single Manufacturer**: One manufacturer managing multiple stores. Multi-manufacturer support requires schema changes.
4. **Product Uniqueness**: Products globally unique by name. Variants (sizes, etc.) require schema modification.
5. **No Barcode/QR Support**: Product identification by name/ID. Physical scanning not included.
6. **Database**: PostgreSQL provisioned and accessible via environment variables.
7. **OAuth Setup**: Google OAuth credentials configured in environment variables.

---

## Future Enhancements (Not Implemented)

1. Analytics Dashboard: Reports on slow-moving items, dead inventory, turnover rates
2. Low Stock Alerts: Automated notifications when inventory falls below threshold
3. Bulk Operations: Import/export inventory data
4. Audit Logs: Detailed history of all inventory changes
5. Multi-Unit Support: Different measurement units (kg, pieces, etc.)
6. Damaged Inventory Tracking: Separate tracking for damaged items
7. Reorder Points: Automatic restocking suggestions

---

## Deployment Information

- **Platform**: [To be filled - Vercel/Netlify/Railway recommended]
- **Database**: PostgreSQL (managed service recommended)
- **Environment Variables Required**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID
  - `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET`: Google OAuth client secret
  - `NEXTAUTH_SECRET`: Secret for NextAuth session encryption
  - `NEXTAUTH_URL`: Application URL

---

## Conclusion

This inventory management system addresses the core visibility problem faced by Indian material businesses through real-time inventory tracking across multiple stores. The role-based architecture enables manufacturers to maintain oversight while empowering store owners to manage inventory independently. The system provides a foundation for future analytics and scaling, addressing immediate inventory visibility needs while setting the stage for advanced features like dead inventory identification and performance analytics. The implementation uses modern web technologies ensuring scalability, security, and maintainability for businesses digitizing their inventory management processes.
