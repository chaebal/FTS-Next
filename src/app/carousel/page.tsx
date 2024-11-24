"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { FetchArticles } from "../news/page";

const items = Array.from({ length: 5 });

type Article = {
  title: string;
  link: string;
  summary: string;
  image: string; // Ensure image is always included
};

type NewsPageProps = {
  articles: Article[];
};

export default function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch("/api/articles");

      if (response.ok) {
        const data = await response.json();
        setArticles(data); // Assuming the API returns an array of articles
        console.log(data);
      } else {
        console.error("Failed to fetch articles");
      }
    };

    fetchArticles();
  }, []);

  const handleNext = () => {
    // Move backward instead of forward
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + articles.length) % articles.length
    );
  };

  const handlePrevious = () => {
    // Move forward instead of backward
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  return (
    <div className="w-full max-w-s relative w-full flex">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {articles.map((article, index) => (
            <div className="w-full flex-shrink-0" key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square p-6">
                    <div>
                      <h1>Latest News</h1>
                      <img
                        src={article.image}
                        alt={article.title}
                        className="mt-4"
                      />
                      <a
                        href={article.link}
                        target="_blank"
                        className="hover:underline"
                      >
                        <h1 className="mt-6">{article.title}</h1>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute flex justify-between bottom-[1px] transform -translate-y-1/2 w-full px-20">
        {/* Left Arrow */}
        <button
          onClick={handleNext}
          className="p-2 rounded-full flex items-center justify-center"
          aria-label="Previous"
        >
          {/* &#8592; Unicode left arrow */}
          <span className="text-3xl font-extrabold text-gray-800 hover:text-white">
            &#8592;
          </span>{" "}
          {/* Thick left arrow */}
        </button>

        {/* Page Number */}
        <div className="flex items-center justify-center">
          <span className="text-white text-lg">{currentIndex + 1}</span>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full flex items-center justify-center"
          aria-label="Next"
        >
          {/* &#8594; Unicode right arrow */}
          <span className="text-3xl font-extrabold text-gray-800 hover:text-white">
            &#8594;
          </span>{" "}
          {/* Thick right arrow */}
        </button>
      </div>
    </div>
  );
}
