import { notFound } from 'next/navigation';
import { getArticlesByCategory } from '@/lib/articles';
import { CategoryPageClient } from './CategoryPageClient';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  const categoryMap: Record<string, string> = {
    'css': 'css',
    'javascript': 'javascript',
    'react': 'react',
    'react-js': 'react',
    'tailwind': 'tailwind',
    'nextjs': 'nextjs',
    'typescript': 'typescript',
    'photography': 'photography',
    'development': 'development',
    'travel': 'travel',
    'food': 'food',
  };

  const category = categoryMap[slug];
  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(category);
  
  return <CategoryPageClient slug={slug} initialArticles={articles} />;
}

// Generate metadata for the category page
export async function generateMetadata({ params }: CategoryPageProps) {
  try {
    const { slug } = await params;
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');

    return {
      title: `${categoryName} Articles | DonOzOn Blog`,
      description: `Explore our collection of ${categoryName.toLowerCase()} tutorials, guides, and insights. Learn with step-by-step instructions and practical examples.`,
      openGraph: {
        title: `${categoryName} Articles | DonOzOn Blog`,
        description: `Explore our collection of ${categoryName.toLowerCase()} tutorials and guides.`,
        type: 'website',
        siteName: 'DonOzOn Blog',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryName} Articles | DonOzOn Blog`,
        description: `Explore our collection of ${categoryName.toLowerCase()} tutorials and guides.`,
        creator: '@donozon',
      },
      keywords: `${categoryName.toLowerCase()}, tutorials, guides, web development, programming, ${slug}`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Category | DonOzOn Blog',
      description: 'Explore articles by category on DonOzOn Blog.',
    };
  }
}