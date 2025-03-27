# Hotel Link in Bio Platform

A modern, customizable link-in-bio platform specifically designed for hotels to manage and share their digital presence efficiently.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0+-black)

## 🌟 Features

- **Multi-Hotel Management**: Seamlessly manage multiple hotel properties from a single dashboard
- **Customizable Links**: Create and organize links in draggable blocks
- **Interactive Modules**: 
  - Booking Integration
  - Restaurant Menus
  - Spa Services
  - Activities & Events
  - And more...
- **Real-time Analytics**: Track engagement and visitor interactions
- **Team Collaboration**: Invite and manage team members with role-based access
- **Responsive Design**: Beautiful display on all devices with a mobile-first approach
- **Modern UI**: Built with Shadcn UI and Radix for a premium user experience

## 🚀 Tech Stack

- **Frontend**: 
  - Next.js 14+ with App Router
  - React Server Components (RSC)
  - TypeScript
  - Tailwind CSS
  - Shadcn UI / Radix UI
  
- **Backend**: 
  - Next.js API Routes
  - Supabase for data storage
  - Row Level Security (RLS)

- **Authentication**: 
  - Supabase Auth
  - Role-based access control

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hotel-link-in-bio.git
cd hotel-link-in-bio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Run the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── (marketing)/       # Marketing pages
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── dashboard/        # Dashboard-specific components
├── contexts/             # React contexts
├── lib/                  # Utility functions
└── utils/               # Helper functions
```

## 🔒 Security

- Supabase RLS policies for data protection
- Type-safe database operations
- Secure authentication flow
- Input validation and sanitization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vercel](https://vercel.com/) for hosting and deployment

## 📧 Support

For support, please open an issue in the GitHub repository or contact us at support@yourdomain.com.

---

Built with ❤️ for the hospitality industry
