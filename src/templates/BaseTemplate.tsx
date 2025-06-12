import type { ReactNode } from 'react';
import Link from 'next/link';

import { AppConfig } from '@/utils/AppConfig';

type IBaseTemplateProps = {
  leftNav?: ReactNode;
  rightNav?: ReactNode;
  children: ReactNode;
};

const BaseTemplate = (props: IBaseTemplateProps) => (
  <div className="w-full text-gray-700 antialiased">
    <div className="mx-auto max-w-screen-xl">
      <header className="border-b border-gray-300">
        <div className="pb-8 pt-16">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {AppConfig.site_name}
              </div>
              <div className="text-xl">{AppConfig.description}</div>
            </div>
            <div>
              <nav>
                <ul className="flex wrap text-xl">
                  {props.leftNav}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="content py-5 text-xl">{props.children}</main>

      <footer className="border-t border-gray-300 py-8 text-center text-sm">
        © Copyright {new Date().getFullYear()} {AppConfig.title}. Made with{' '}
        <span role="img" aria-label="Love">♥</span>
          ♥
        by <Link href="/">{AppConfig.author}</Link>
        by <Link href="/">{AppConfig.author}</Link>
        {' - '}
        <Link href="/">Powered by Next.js and Tailwind CSS</Link>
      </footer>
    </div>
  </div>
);

export { BaseTemplate };