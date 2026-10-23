import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { DEMO_BARBER_ID, PORTFOLIO_SAMPLE_IMAGES } from '../data/mock';

export type PortfolioPost = {
  id: string;
  barberId: string;
  imageUrl: string;
  title: string;
  description?: string;
  /** Data de publicação em milissegundos (epoch). */
  publishedAt: number;
};

type NewPortfolioPost = Omit<PortfolioPost, 'id' | 'publishedAt'>;

type PortfolioContextValue = {
  /** Publicações do feed, da mais recente para a mais antiga. */
  posts: PortfolioPost[];
  addPost: (post: NewPortfolioPost) => PortfolioPost;
  removePost: (id: string) => void;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Publicações mockadas até existir backend e upload real.
const INITIAL_POSTS: PortfolioPost[] = [
  {
    id: 'p1',
    barberId: DEMO_BARBER_ID,
    imageUrl: PORTFOLIO_SAMPLE_IMAGES[0],
    title: 'Degradê navalhado',
    description: 'Degradê baixo com acabamento na navalha e topo texturizado.',
    publishedAt: Date.now() - 2 * MS_PER_DAY,
  },
  {
    id: 'p2',
    barberId: DEMO_BARBER_ID,
    imageUrl: PORTFOLIO_SAMPLE_IMAGES[2],
    title: 'Barba alinhada + corte social',
    description: 'Corte social na tesoura com barba desenhada e toalha quente.',
    publishedAt: Date.now() - 6 * MS_PER_DAY,
  },
  {
    id: 'p3',
    barberId: DEMO_BARBER_ID,
    imageUrl: PORTFOLIO_SAMPLE_IMAGES[4],
    title: 'Texturizado com risco',
    publishedAt: Date.now() - 11 * MS_PER_DAY,
  },
];

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<PortfolioPost[]>(INITIAL_POSTS);

  const addPost = useCallback((data: NewPortfolioPost) => {
    const post: PortfolioPost = { ...data, id: String(Date.now()), publishedAt: Date.now() };
    setPosts((current) => [post, ...current]);
    return post;
  }, []);

  const removePost = useCallback((id: string) => {
    setPosts((current) => current.filter((post) => post.id !== id));
  }, []);

  const value = useMemo(() => ({ posts, addPost, removePost }), [posts, addPost, removePost]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio deve ser usado dentro de PortfolioProvider');
  return context;
}
