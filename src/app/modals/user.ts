import { Category } from "./category";

export interface User {
  name: string
  email: string
  categories: Array<Category>
}
