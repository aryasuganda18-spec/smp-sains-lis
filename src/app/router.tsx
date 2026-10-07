import { type LoaderFunctionArgs, createBrowserRouter, redirect } from 'react-router-dom';
import { LoadingBlock } from '@/components/ui/AsyncView';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Home } from '@/pages/home/Home';
import { NotFound } from '@/pages/NotFound';
import { RouteError } from '@/pages/RouteError';
import { LEGACY_REDIRECTS } from './legacyRedirects';
import { ROUTES, albumPath, articlePath } from './routes';

const lazyPage =
  <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  async () => ({ Component: (await load())[name] });

const redirectWithParam = (param: string, build: (value: string) => string, fallback: string) =>
  ({ request }: LoaderFunctionArgs) => {
    const value = new URL(request.url).searchParams.get(param);
    return redirect(value ? build(value) : fallback);
  };

const BLANK_ROUTE = <></>;
const REDIRECT_ROUTE = { element: BLANK_ROUTE, hydrateFallbackElement: BLANK_ROUTE };

export const router = createBrowserRouter(
  [
    {
      element: <PublicLayout />,
      hydrateFallbackElement: <LoadingBlock />,
      children: [
        {
          errorElement: <RouteError />,
          children: [
            { index: true, element: <Home /> },
            { path: ROUTES.academics, lazy: lazyPage(() => import('@/pages/Academics'), 'Academics') },
            { path: ROUTES.gallery, lazy: lazyPage(() => import('@/pages/Gallery'), 'Gallery') },
            { path: `${ROUTES.gallery}/:albumId`, lazy: lazyPage(() => import('@/pages/Album'), 'Album') },
            { path: ROUTES.news, lazy: lazyPage(() => import('@/pages/News'), 'News') },
            { path: `${ROUTES.news}/:slug`, lazy: lazyPage(() => import('@/pages/Article'), 'Article') },
            { path: ROUTES.videos, lazy: lazyPage(() => import('@/pages/Videos'), 'Videos') },
            { path: ROUTES.announcements, lazy: lazyPage(() => import('@/pages/Announcements'), 'Announcements') },
            { path: ROUTES.contact, lazy: lazyPage(() => import('@/pages/Contact'), 'Contact') },
            { path: '*', element: <NotFound /> },
          ],
        },
      ],
    },
    {
      path: `${ROUTES.admin}/*`,
      hydrateFallbackElement: <LoadingBlock />,
      lazy: lazyPage(() => import('@/admin/AdminApp'), 'AdminApp'),
    },
    ...Object.entries(LEGACY_REDIRECTS).map(([path, target]) => ({ path, ...REDIRECT_ROUTE, loader: () => redirect(target) })),
    {
      path: '/berita-detail.html',
      ...REDIRECT_ROUTE,
      loader: redirectWithParam('slug', articlePath, ROUTES.news),
    },
    {
      path: '/galeri-album.html',
      ...REDIRECT_ROUTE,
      loader: redirectWithParam('id', albumPath, ROUTES.gallery),
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || undefined },
);
