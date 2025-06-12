# Donozon Blog

A modern blog built with Next.js 15, TypeScript, and Tailwind CSS, based on the Figma design from Digitaldastin.

## Features

- 🚀 **Next.js 15** with App Router
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Tailwind CSS** for styling
- 📝 **TypeScript** for type safety
- 🔍 **SEO Optimized** - Meta tags and structured data
- 📚 **Article Management** - Categorized blog posts
- 💌 **Newsletter Subscription** - Stay updated with latest posts
- 🎯 **Category Browsing** - Filter articles by technology
- 📧 **Contact Form** - Get in touch functionality

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Custom React components
- **Icons:** Heroicons (SVG)
- **Images:** Next.js Image optimization
- **Fonts:** Inter (Google Fonts)

## Project Structure

```
donozonblog/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── about/             # About page
│   │   ├── articles/          # Articles listing and individual articles
│   │   ├── categories/        # Categories listing
│   │   ├── category/          # Dynamic category pages
│   │   ├── contact/           # Contact page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ArticleCard.tsx    # Article card component
│   │   ├── BrowseCategory.tsx # Category browsing section
│   │   ├── Footer.tsx         # Footer component
│   │   ├── Navbar.tsx         # Navigation component
│   │   ├── Section.tsx        # Section wrapper component
│   │   └── SubscribeSection.tsx # Newsletter subscription
│   ├── lib/                   # Utility functions and data
│   │   └── articles.ts        # Sample articles data
│   ├── types/                 # TypeScript type definitions
│   │   └── Article.ts         # Article interface
│   ├── utils/                 # Configuration and utilities
│   │   └── AppConfig.ts       # App configuration
│   └── templates/             # Page templates
│       └── BaseTemplate.tsx   # Base template (optional)
├── public/                    # Static assets
├── next.config.ts            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Customization

### Configuration

Update the app configuration in `src/utils/AppConfig.ts`:

```typescript
export const AppConfig = {
  site_name: 'Your Blog Name',
  title: 'Your Blog Title',
  description: 'Your blog description',
  author: 'Your Name',
  // ... other settings
};
```

### Adding Articles

Add new articles to `src/lib/articles.ts` or connect to a CMS:

```typescript
{
  id: 'unique-id',
  title: 'Article Title',
  slug: 'article-slug',
  excerpt: 'Article excerpt',
  content: 'Full article content',
  author: 'Author Name',
  publishedAt: 'Date',
  readTime: 'X min read',
  imageUrl: 'image-url',
  category: 'category-name',
  tags: ['tag1', 'tag2'],
}
```

### Styling

The project uses Tailwind CSS for styling. Customize the design by:

1. Modifying Tailwind classes in components
2. Adding custom CSS in `src/app/globals.css`
3. Updating the Tailwind configuration if needed

## Design

This blog is based on the Figma design by Digitaldastin:
- Clean, modern interface
- Orange accent color (#f97316)
- Card-based layout
- Responsive grid system
- Hover effects and transitions

## Deployment

The blog can be deployed on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Heroku**
- **AWS**
- Any platform supporting Node.js

For Vercel deployment:
```bash
npx vercel --prod
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

- Design inspiration: Digitaldastin Figma template
- Built with Next.js, TypeScript, and Tailwind CSS
- Icons: Heroicons
- Fonts: Inter (Google Fonts)