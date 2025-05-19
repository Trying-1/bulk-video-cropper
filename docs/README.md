# Bulk Video Cropper Documentation

This directory contains documentation for the Bulk Video Cropper application. Each document provides detailed information about specific aspects of the application. The documentation is regularly updated to reflect recent implementations and improvements to the application.

## Core Documentation

- [architecture.md](architecture.md)
  - System architecture overview
  - Component structure
  - Configuration architecture
  - Security implementation overview
  - Data flow

- [configuration-guide.md](configuration-guide.md)
  - Centralized configuration system
  - Configuration file structure
  - Security configurations
  - How to modify app settings
  - Best practices

## Security Documentation

- [security-guide.md](security-guide.md) 🆕
  - Comprehensive security implementation
  - Environment validation
  - CSRF protection
  - Rate limiting
  - Secure storage
  - Security monitoring
  - Subscription validation

- [security-vulnerabilities.md](security-vulnerabilities.md)
  - Security vulnerabilities analysis
  - Remediation status
  - Completed security improvements
  - Remaining action items

## User Interface Documentation

- [clean-interface-guide.md](clean-interface-guide.md)
  - Clean interface design principles
  - No popup notifications approach
  - Non-intrusive security measures
  - Premium feature indication without popups
  - Removed QuickStart and Welcome popups
  - Implementation examples
  
- [legal-compliance.md](legal-compliance.md) 🆕
  - Terms of Service acceptance functionality
  - Cookie consent banner implementation
  - Legal pages (Privacy Policy, Terms of Service, and Cookies Policy)
  - LegalSideNav component for navigation
  - Improved contrast for better readability

## Technical Documentation

- [ffmpeg-loading-strategies.md](ffmpeg-loading-strategies.md)
  - Analysis of different FFmpeg loading approaches
  - Impact on various monetization strategies

- [payment-processing.md](payment-processing.md) 🆕
  - Stripe API integration overview
  - Backend payment processing endpoints
  - Frontend payment components using Stripe Elements
  - Handling successful payments and subscriptions
  - Error handling for payment issues
  - Implementation recommendations

- [api-reference.md](api-reference.md)
  - API endpoints documentation
  - Request/response formats
  - Authentication methods
  - Security measures

- [deployment-guide.md](deployment-guide.md)
  - Deployment instructions
  - Environment setup
  - Security configurations
  - Configuration options

- [troubleshooting.md](troubleshooting.md)
  - Common issues and solutions
  - Error handling
  - Debugging tips

## Contributing

When adding new documentation:
1. Create a new markdown file with a descriptive name
2. Add a brief description in this README
3. Follow the existing documentation style and format
4. Include code examples where relevant
5. Keep content clear and concise

## Maintainers

- [Your Name](your-email@example.com)
- [Contributor Name](contributor-email@example.com)

## License

[Your License Information Here]
