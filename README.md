# VideoVault

A modern video upload and management platform built with Next.js, allowing users to upload, organize, and preview their video content with automatic thumbnail generation.

## Features

- **Video Upload**: Upload videos with custom titles, descriptions, and tags
- **Automatic Thumbnails**: AI-powered thumbnail generation using ImageKit DAM
- **Video Preview**: Built-in custom video player for content preview
- **User Authentication**: Secure login/signup with NextAuth
- **Media Management**: Organized video library with metadata
- **Responsive Design**: Works seamlessly across all devices
- **Modern UI**: Clean Vercel-inspired interface with beautiful design
- **Performance Optimized**: Fast loading with efficient video streaming
- **Video Tagging**: Organize videos with custom tags
- **Advanced Options**: Quality control and video settings

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with Vercel-inspired design system
- **Authentication**: NextAuth
- **Database**: MongoDB with Mongoose
- **Video Processing**: ImageKit DAM
- **State Management**: React Context API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account or local MongoDB instance
- ImageKit account
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rajput-vishal01/videovault
   cd videovault
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env

   MONGODB_URI=
   NEXTAUTH_SECRET=

   #imagekit configs

   NEXT_PUBLIC_PUBLIC_KEY=public_...............
   NEXT_PUBLIC_URL_ENDPOINNT=https://ik.imagekit.io/.......
   IMAGEKIT_PRIVATE_KEY=private_.......
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

Feel free to reach out if you have any questions!

- **Portfolio** : [askvishal.in](https://askvishal.in/)
- **GitHub**: [rajput-vishal01](https://github.com/rajput-vishal01)
- **Email**: [askvishal.me@gmail.com](mailto:askvishal.me@gmail.com)
