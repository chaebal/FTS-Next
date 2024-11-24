// import axios from "axios";
// import * as cheerio from "cheerio";

// type Article = {
//   title: string;
//   link: string;
//   summary: string;
//   image: string; // Ensure image is always included
// };

// export async function GET() {
//   const url = "https://futsalfeed.com/original-content";
//   let articles: Article[] = [];

//   try {
//     const { data } = await axios.get(url);

//     const $ = cheerio.load(data);

//     // Scrape article data
//     articles = $(".news-post")
//       .map((_, element) => {
//         const title = $(element).find(".news-post__title").text().trim();
//         const link = $(element).find("a").attr("href") || "#";
//         const summary = $(element).find(".article-summary").text().trim();
//         let image = $(element).find("img").attr("src") || "";

//         // Ensure full image URL if relative
//         if (image && !image.startsWith("http")) {
//           image = `https://futsalfeed.com${image}`;
//         }

//         // Return with image field populated
//         return { title, link: `https://futsalfeed.com${link}`, summary, image };
//       })
//       .get();
//     return new Response(JSON.stringify(data), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching articles:", error);
//     return new Response("Error fetching data", { status: 500 });
//   }
// }

import axios from "axios";
import * as cheerio from "cheerio";

type Article = {
  title: string;
  link: string;
  summary: string;
  image: string; // Ensure image is always included
};

export async function GET() {
  const url = "https://futsalfeed.com/original-content";
  let articles: Article[] = [];

  try {
    const { data } = await axios.get(url); // Fetch the HTML content

    const $ = cheerio.load(data); // Parse HTML with Cheerio

    // Scrape article data
    articles = $(".news-post")
      .map((_, element) => {
        const title = $(element).find(".news-post__title").text().trim();
        const link = $(element).find("a").attr("href") || "#";
        const summary = $(element).find(".article-summary").text().trim();
        let image = $(element).find("img").attr("src") || "";

        // Ensure full image URL if relative
        if (image && !image.startsWith("http")) {
          image = `https://futsalfeed.com${image}`;
        }

        // Return the article data
        return { title, link: `https://futsalfeed.com${link}`, summary, image };
      })
      .get(); // Convert Cheerio object to a plain array

    // Return the articles as a JSON response
    return new Response(JSON.stringify(articles), { status: 200 });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return new Response("Error fetching data", { status: 500 });
  }
}
