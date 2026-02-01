export type Announcement = {
  id: string;
  created_at: string;
  updated_at: string;
  date: string;
  category: string;
  title: string;
  content: Record<string, unknown>;
  status: "draft" | "published";
  author_id: string | null;
};

export type Introduction = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: Record<string, unknown>;
};

export type Competition = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  link: string;
  image: string | null;
  date: string;
};

export type Result = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  date: string;
  header_image: string | null;
  summary: string;
  content: Record<string, unknown>;
  status: "draft" | "published";
  author_id: string | null;
};
