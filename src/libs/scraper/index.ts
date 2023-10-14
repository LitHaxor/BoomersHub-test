import { load } from "cheerio";

type LoadHtmlParams = {
  url: string;
  method: string;
};

export async function loadHtml({ url, method }: LoadHtmlParams) {
  try {
    const res = await fetch(url, {
      method,
    });

    return load(await res.text());
  } catch (err) {
    console.error(err);
    return null;
  }
}
