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

interface ResultsListProps {
  articles: Article[];
}

export const ResultsList: React.FC<ResultsListProps> = ({ articles }) => {
  return (
    <div className="grid gap-4">
      {articles.map((article) => (
        <Card key={article.id}>
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
            <CardDescription>{article.authors.join(", ")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{article.abstract}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{article.year}</Badge>
              <Badge variant="outline">{article.journal}</Badge>
              {article.keywords.map((keyword) => (
                <Badge key={keyword} variant="default">
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
