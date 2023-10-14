import { Websites } from "src/websites";

export type SearchDto = {
  query: string;
  type: keyof typeof Websites;
};
