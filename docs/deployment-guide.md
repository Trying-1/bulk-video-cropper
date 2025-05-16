# Bulk Video Cropper Deployment Guide

This document provides detailed instructions for deploying the Bulk Video Cropper application.

## Prerequisites

1. **System Requirements**
   - Node.js 18+
   - npm or yarn
   - Git
   - Modern web browser

2. **Dependencies**
   - Next.js 14
   - React 18
   - FFmpeg.js
   - Firebase (optional)

## Environment Setup

### 1. Development Environment

```bash
# Clone the repository
$ git clone <repository-url>
$ cd bulk-video-cropper

# Install dependencies
$ npm install

# Create .env file
$ cp .env.example .env

# Start development server
$ npm run dev
```

### 2. Production Environment

```bash
# Build for production
$ npm run build

# Start production server
$ npm start
```

## Configuration

### 1. Environment Variables

Create a `.env` file with the following variables:

```bash
# Firebase Configuration (Optional)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_MAX_VIDEO_COUNT=100

# Application Settings
NEXT_PUBLIC_APP_NAME=Bulk Video Cropper
NEXT_PUBLIC_VERSION=1.0.0
```

### 2. FFmpeg Configuration

```bash
# FFmpeg core version
NEXT_PUBLIC_FFMPEG_VERSION=0.12.2

# Maximum video size (in MB)
NEXT_PUBLIC_MAX_VIDEO_SIZE=100
```

## Deployment Options

### 1. Vercel

1. Install Vercel CLI
```bash
$ npm install -g vercel
```

2. Deploy
```bash
$ vercel
```

3. Set environment variables in Vercel dashboard

### 2. Netlify

1. Install Netlify CLI
```bash
$ npm install -g netlify-cli
```

2. Deploy
```bash
$ netlify deploy
```

3. Set environment variables in Netlify dashboard

### 3. Custom Server

1. Build the application
```bash
$ npm run build
```

2. Copy build output
```bash
$ cp -r out/* /path/to/server/public/
```

3. Configure web server
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/server/public;
        try_files $uri $uri/ /index.html;
    }
}
```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` file
   - Use secure variable management
   - Regularly rotate sensitive keys

2. **File Uploads**
   - Implement size limits
   - Validate file types
   - Use secure storage

3. **Authentication**
   - Use secure tokens
   - Implement rate limiting
   - Regular security audits

## Maintenance

### 1. Regular Updates

```bash
# Update dependencies
$ npm update

# Check for security vulnerabilities
$ npm audit

# Run tests
$ npm test
```

### 2. Monitoring

- CPU usage monitoring
- Memory usage tracking
- Error logging
- Performance metrics

### 3. Backup

- Regular database backups
- Configuration backups
- File storage backups

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version
   - Clear npm cache
   - Reinstall dependencies

2. **Deployment Issues**
   - Verify environment variables
   - Check build logs
   - Validate configuration

3. **Performance Issues**
   - Monitor resource usage
   - Optimize video processing
   - Implement caching

## Best Practices

1. **Deployment**
   - Use automated deployment
   - Implement rollback procedures
   - Test before deployment

2. **Security**
   - Regular security updates
   - Monitor for vulnerabilities
   - Implement proper logging

3. **Maintenance**
   - Regular code reviews
   - Performance testing
   - User feedback monitoring
