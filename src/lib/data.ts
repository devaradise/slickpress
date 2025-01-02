import { getCollection } from "astro:content";
import type { SimplifiedCategory, SimplifiedMedia, SimplifiedPage, SimplifiedPost, SimplifiedTag, SimplifiedUser } from "./types";

const rawTags = await getCollection('tags');
const rawCategories = await getCollection('categories');
const rawUsers = await getCollection('users');
const rawMedia = await getCollection('media');
const rawPosts = await getCollection('posts');
const rawPages = await getCollection('pages');

export const tags: SimplifiedTag[] = rawTags.map(tag => ({
  id: tag.id,
  count: tag.data.count,
  description: tag.data.description,
  name: tag.data.name,
  slug: tag.data.slug
}))

const idTagMapping = (() => {
  const mapping: Record<string, SimplifiedTag> = {};
  for (const tag of tags) {
    mapping[tag.id] = tag;
  }
  return mapping;
})()

const idCategoryMapping = (() => {
  const mapping: Record<string, SimplifiedCategory> = {};
  for (const cat of rawCategories) {
    mapping[cat.id] = {
      id: cat.id,
      count: cat.data.count,
      description: cat.data.description,
      name: cat.data.name,
      slug: cat.data.slug,
    };
  }
  return mapping;
})()

export const categories: SimplifiedCategory[] = rawCategories.map(cat => ({
  id: cat.id,
  count: cat.data.count,
  description: cat.data.description,
  name: cat.data.name,
  slug: cat.data.slug,
  parent: cat.data.parent && idCategoryMapping[cat.data.parent.id],
}))

export const slugCategoryMapping = (() => {
  const mapping: Record<string, SimplifiedCategory> = {};
  for (const cat of categories) {
    mapping[cat.slug] = cat;
  }
  return mapping;
})()

export const users: SimplifiedUser[] = rawUsers.map(user => ({
  id: user.id,
  name: user.data.name,
  slug: user.data.slug,
  description: user.data.description,
  avatarUrls: user.data.avatar_urls
}))

const idUserMapping = (() => {
  const mapping: Record<string, SimplifiedUser> = {};
  for (const user of users) {
    mapping[user.id] = user;
  }
  return mapping;
})()

export const media: SimplifiedMedia[] = rawMedia.map(media => ({
  id: media.id,
  title: media.data.title.rendered,
  slug: media.data.slug,
  sourceUrl: media.data.source_url,
  status: media.data.status,
  date: media.data.date,
  modified: media.data.modified,
  mediaType: media.data.media_type,
  mimeType: media.data.mime_type,
  mediaDetails: media.data.media_details
}))

const idMediaMapping = (() => {
  const mapping: Record<string, SimplifiedMedia> = {};
  for (const singleMedia of media) {
    mapping[singleMedia.id] = singleMedia;
  }
  return mapping;
})()


export const posts: SimplifiedPost[] = rawPosts.map(post => ({
  id: post.id,
  title: post.data.title.rendered,
  slug: post.data.slug,
  status: post.data.status,
  type: post.data.type,
  categories: post.data.categories.map(cat => idCategoryMapping[cat.id]),
  tags: post.data.tags.map(tag => idCategoryMapping[tag.id]),
  date: post.data.date,
  modified: post.data.modified,
  content: post.rendered?.html || post.data.content.rendered,
  excerpt: post.data.excerpt.rendered,
  author: idUserMapping[post.data.author.id],
  featuredImage: post.data.featured_media && idMediaMapping[post.data.featured_media?.id]
})).sort((a, b) => b.date.valueOf() - a.date.valueOf());

const idPostMapping = (() => {
  const mapping: Record<string, SimplifiedPost> = {};
  for (const post of posts) {
    mapping[post.id] = post;
  }
  return mapping;
})()

export const pages: SimplifiedPage[] = rawPages.map(page => ({
  id: page.id,
  title: page.data.title.rendered,
  slug: page.data.slug,
  status: page.data.status,
  type: page.data.type,
  date: page.data.date,
  modified: page.data.modified,
  content: page.data.content.rendered,
  excerpt: page.data.excerpt.rendered,
  author: idUserMapping[page.data.author.id],
  featuredImage: page.data.featured_media && idMediaMapping[page.data.featured_media?.id]
}));

const idPageMapping = (() => {
  const mapping: Record<string, SimplifiedPage> = {};
  for (const page of pages) {
    mapping[page.id] = page;
  }
  return mapping;
})()
