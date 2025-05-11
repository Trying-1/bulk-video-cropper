# Video Cropper MVP

A simple web application for cropping videos for social media platforms.

## Features

- Upload videos for cropping
- Adjust crop dimensions and position
- Select from common aspect ratio presets (16:9, 9:16, 1:1, 4:5, etc.)
- Process videos with a simple interface
- Download cropped videos

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```
   cd webapp_mvp
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

- `src/app/page.tsx` - Landing page
- `src/app/editor/page.tsx` - Video editor page with cropping functionality
- `src/app/globals.css` - Global styles using Tailwind CSS

## MVP Focus

This MVP version focuses on the core functionality of video cropping with a simple and intuitive interface. Advanced features like user accounts, project saving, and batch processing will be added in future versions.
