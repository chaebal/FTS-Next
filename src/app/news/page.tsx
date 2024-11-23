// import axios from "axios";
// import * as cheerio from "cheerio";

// type Article = {
//   title: string;
//   link: string;
//   summary: string;
//   image: string;
// };

// async function fetchArticles(): Promise<Article[]> {
//   const url = "https://futsalfeed.com/original-content";
//   let articles: Article[] = [];

//   try {
//     // Fetch HTML content from the webpage
//     const { data } = await axios.get(url);

//     // Load HTML into Cheerio for parsing
//     const $ = cheerio.load(data);

//     // Scrape article data
//     articles = $(".news-post")
//       .map((_, element) => {
//         const title = $(element).find(".news-post__title").text().trim();
//         const link = $(element).find("a").attr("href") || "#";
//         const summary = $(element).find(".article-summary").text().trim();
//         const image = $(element).find(".img").attr("src") || "";
//         return { title, link: `https://futsalfeed.com${link}`, summary };
//       })
//       .get();
//   } catch (error) {
//     console.error("Error scraping data:", error);
//   }

//   return articles;
// }

// export default async function NewsPage() {
//   const articles = await fetchArticles();

//   return (
//     <div>
//       <h1>Futsal News</h1>
//       <div>
//         {articles.map((article, index) => (
//           <div key={index}>
//             <img
//               src={article.image}
//               alt={article.title}
//               style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
//             />

//             <h2>{article.title}</h2>
//             <p>{article.summary}</p>
//             <a
//               href={article.link}
//               target="_blank"
//               rel="noopener noreferrer"
//             ></a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import axios from "axios";
import * as cheerio from "cheerio";

type Article = {
  title: string;
  link: string;
  summary: string;
  image: string; // Ensure image is always included
};

async function fetchArticles(): Promise<Article[]> {
  const url = "https://futsalfeed.com/original-content";
  let articles: Article[] = [];

  try {
    // Fetch HTML content from the webpage
    const { data } = await axios.get(url);

    // Load HTML into Cheerio for parsing
    const $ = cheerio.load(data);

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

        // Return with image field populated
        return { title, link: `https://futsalfeed.com${link}`, summary, image };
      })
      .get();
  } catch (error) {
    console.error("Error scraping data:", error);
  }

  return articles;
}

export default async function NewsPage() {
  const articles = await fetchArticles();

  return (
    <div>
      <h1>Futsal News</h1>
      <div>
        {/* {articles.map((article, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <img
              src={article.image}
              alt={article.title}
              // style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
            />
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))} */}
        <img
          src={articles[1].image}
          alt={articles[1].title}
          // style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
