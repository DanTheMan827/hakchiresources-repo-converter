export interface Attachment {
  caption: string,
  description: string,
  id: number,
  images: ThumbnailImages,
  mime_type: string,
  parent: number,
  slug: string,
  title: string,
  url: string
}

export interface Author {
  description: string,
  first_name: string,
  id: number,
  last_name: string,
  name: string,
  nickname: string,
  slug: string,
  url: string
}

export interface Category {
  description: string,
  id: number,
  parent: number,
  post_count: number,
  slug: string,
  title: string
}

export interface Comment {
  content: string,
  date: string,
  id: number,
  name: string,
  parent: number,
  url: string
}

export interface CustomField {
  user_submit_name: string[],
  usp_custom_field: string[],
  user_submit_url: string[],
  any: string[]
}

export interface Tag {
  description: string,
  id: number,
  post_count: number,
  slug: string,
  title: string
}

export interface ThumbnailImage {
  width: number,
  height: number,
  url: string
}

export interface ThumbnailImages {
  full: ThumbnailImage,
  large: ThumbnailImage,
  medium: ThumbnailImage,
  medium_large: ThumbnailImage,
  profile_24: ThumbnailImage,
  profile_48: ThumbnailImage,
  profile_96: ThumbnailImage,
  thumbnail: ThumbnailImage
}

export interface Post {
  attachments: Attachment[],
  author: Author[],
  categories: Category[]
  comment_count: number,
  comment_status: string,
  comments: Comment[],
  content: string,
  custom_fields: CustomField,
  date: string,
  excerpt: string,
  id: number,
  modified: string,
  slug: string,
  status: string,
  tags: Tag[],
  thumbnail: string,
  thumbnail_images: ThumbnailImages
  thumbnail_size: "full" | "large" | "medium" | "medium_large" | "profile_24" | "profile_48" | "profile_96" | "thumbnail",
  title: string,
  title_plain: string,
  type: string,
  url: string
}

export interface Query {
  count: string
  ignore_sticky_posts: boolean
}

export interface Posts {
  count: number,
  count_total: number,
  pages: number,
  posts: Post[],
  query: Query,
  status: string
}

export enum ModType {
  Game = ".clvg",
  Hmod = ".hmod"
}
