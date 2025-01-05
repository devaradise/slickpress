import type { CollectionEntry, RenderResult } from "astro:content"

export type SimplifiedPage = {
  id: string,
  title: string,
  slug: string,
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private',
  date: Date,
  modified: Date,
  content: string,
  excerpt: string,
  author: SimplifiedUser,
  featuredImage?: SimplifiedMedia,
  rawPageEntry: CollectionEntry<'pages'>,
  comments?: SimplifiedComment[],
  parent?: SimplifiedPage,
  seoTitle?: string,
  metaDesc?: string,
  isProtected?: boolean,
  commentStatus?: 'open' | 'closed',
}

export type SimplifiedPost = {
  id: string,
  title: string,
  slug: string,
  status: string,
  type: string,
  categories: SimplifiedCategory[],
  tags: SimplifiedTag[],
  date: Date,
  modified: Date,
  content: string,
  excerpt: string,
  author: SimplifiedUser,
  rawPostEntry: CollectionEntry<'posts'>,
  featuredImage?: SimplifiedMedia,
  comments?: SimplifiedComment[],
  seoTitle?: string,
  metaDesc?: string,
  isProtected?: boolean,
  commentStatus?: 'open' | 'closed',
}

export type SimplifiedUser = {
  id: string,
  name: string,
  slug: string,
  description: string,
  avatarUrls: { [key: string]: string },
  seoTitle?: string,
  metaDesc?: string
}

export type SimplifiedTag = {
  id: string,
  count: number,
  description: string,
  name: string,
  slug: string,
  image?: string,
  seoTitle?: string,
  metaDesc?: string,
}

export type SimplifiedCategory = SimplifiedTag & {
  parent?: SimplifiedCategory
}



export type SimplifiedMedia = {
  id: string,
  title: string,
  slug: string,
  sourceUrl: string,
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private' | 'inherit'
  date: Date | null,
  modified: Date,
  mediaType: 'image' | 'file',
  mimeType: string,
  mediaDetails: { [key: string]: any}
}

export type SimplifiedComment = {
  id: string,
  post: SimplifiedPost,
  authorName: string,
  authorUrl: string,
  date: string;
  content: string,
  status: 'approved' | 'pending' | 'rejected',
  parent?: SimplifiedComment,
  author?: SimplifiedUser,
}

export type Pagination = {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPage: number | null;
  previousPage: number | null;
  pageNumbers: number[];
  showFirst: boolean;
  showLast: boolean;
}
