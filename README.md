[![Build Status](https://github.com/DavidKk/vercel-openapi/actions/workflows/coverage.workflow.yml/badge.svg)](https://github.com/DavidKk/vercel-openapi/actions/workflows/coverage.workflow.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Calculators Suite

A lightweight Next.js application providing calculator utilities. This repository currently includes multiple calculator modules for different use cases.

## Core Features

- **API Caching Proxy**: Provides a caching layer for public APIs to reduce direct calls and improve response speed
- **Prices Service**: Built-in calculation utilities for pricing and product-related data, supporting product queries, recommended prices and price history management
  - Product management with unit conversions and formulas
  - Price comparison across different products and brands
  - Price history tracking and analysis
  - RESTful API for integration with external systems
- **Fuel Discount Calculator**: Calculate fuel discount prices based on recharge and gift amounts, with province-specific pricing and discount level indicators
  - Province-specific fuel pricing data
  - Real-time discount calculation based on recharge and gift amounts
  - Visual discount level indicators (Excellent, Good, Acceptable, etc.)
  - Responsive UI with fullscreen mode support
- **MCP (Machine Control Protocol) Support**: Standardized tool interface for integrating with AI agents and automation systems
- **Developer Friendly**: Clean RESTful API design with JWT authentication and 2FA support

## Security Considerations

- All API requests require JWT authentication - please keep your secret key secure
- 2FA verification is optional but strongly recommended for production environments
- Regularly rotate JWT_SECRET and 2FA_SECRET for improved security

## Deploy to Vercel

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDavidKk%2Fvercel-openapi)

### Environment Variables Configuration

Refer to the [`.env.example`](./.env.example) file to set required environment variables:

- `JWT_SECRET`: JWT signing key
- `JWT_EXPIRES_IN`: JWT expiration time
- `ACCESS_2FA_SECRET`: 2FA secret key (optional)
- `ACCESS_USERNAME`: Admin username
- `ACCESS_PASSWORD`: Admin password
