"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/types/types";
import { SkeletonCard } from "./SkeletonCard";

interface ResultsListProps {
  articles: Article[];
  isLoading: boolean;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  articles,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return <p>No articles found. Try a different search query.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article) => (
        <Card key={article.id}>
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
            <CardDescription>
              {article.authors.join(", ")} - {article.year}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{article.abstract}</p>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
