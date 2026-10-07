import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  ARTICLES_PAGE_SIZE,
  fetchAlbumWithPhotos,
  fetchAlbums,
  fetchAnnouncements,
  fetchArticle,
  fetchArticlesPage,
  fetchVideos,
} from './content';

export const useAlbums = () => useQuery({ queryKey: ['albums'], queryFn: fetchAlbums });

export const useAlbum = (albumId: string) =>
  useQuery({ queryKey: ['album', albumId], queryFn: () => fetchAlbumWithPhotos(albumId) });

export const useVideos = () => useQuery({ queryKey: ['videos'], queryFn: fetchVideos });

export const useAnnouncements = () => useQuery({ queryKey: ['announcements'], queryFn: fetchAnnouncements });

export const useArticle = (slug: string) =>
  useQuery({ queryKey: ['article', slug], queryFn: () => fetchArticle(slug) });

export const useArticleList = (category: string | null) =>
  useInfiniteQuery({
    queryKey: ['articles', category],
    queryFn: ({ pageParam }) => fetchArticlesPage(category, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length * ARTICLES_PAGE_SIZE : undefined),
  });
