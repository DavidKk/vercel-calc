[![Build Status](https://github.com/DavidKk/vercel-openapi/actions/workflows/coverage.workflow.yml/badge.svg)](https://github.com/DavidKk/vercel-openapi/actions/workflows/coverage.workflow.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Calculators Suite

A lightweight Next.js application providing calculator utilities. This repository currently includes the Price Calculator module, which provides product management, unit price calculation and price history.

## Core Features

- **API Caching Proxy**: Provides a caching layer for public APIs to reduce direct calls and improve response speed
- **Prices Service**: Built-in calculation utilities for pricing and product-related data, supporting product queries, recommended prices and price history management
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
