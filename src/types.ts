export type Cuisine = "Thai" | "Japanese" | "Korean" | "Chinese" | "Italian" | "Mexican" | "Indian" | "American" | "International";

export interface Recipe {
  id: string;          // slug
  title: string;
  cuisine: Cuisine;
  difficulty: "Easy" | "Medium" | "Hard";
  time: number;        // minutes
  servings: number;
  calories?: number;
  image?: string;      // /images/x.jpg
  summary: string;
  ingredients: string[];
  steps: string[];
  tags?: string[];
}
