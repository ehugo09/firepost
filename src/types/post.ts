export interface PostForm {
  title: string;
  content: string;
  postType: "now" | "schedule";
  platforms: string[];
  scheduledDate?: Date;
}