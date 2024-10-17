import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Plus, Download } from "lucide-react";
import { convertArticlesToCSV, downloadCSV } from "@/utils/csvExport";
import { useArticleContext } from "@/contexts/ArticleContext";

export const QueryForm: React.FC = () => {
  const {
    articles,
    loading,
    hasMore,
    searchArticles,
    loadMoreArticles,
    activeTab,
  } = useArticleContext();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchArticles(query, activeTab);
  };

  const handleLoadMore = () => {
    loadMoreArticles();
  };

  const handleDownloadCSV = () => {
    const csvContent = convertArticlesToCSV(articles);
    downloadCSV(csvContent, "articles.csv");
  };

  return (
    <div className="mb-6 space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-4 items-end">
        <div className="flex-grow">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your research query"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="citations">Citations</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={loading}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>
      {articles.length > 0 && (
        <div className="flex items-center justify-between">
          <Button
            onClick={handleLoadMore}
            disabled={loading || !hasMore}
            variant="outline"
            className="flex-grow"
          >
            <Plus className="mr-2 h-4 w-4" />
            Load More
          </Button>
          <Button
            onClick={handleDownloadCSV}
            variant="outline"
            className="ml-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
          <Badge variant="secondary" className="ml-2 h-9">
            {articles.length} articles
          </Badge>
        </div>
      )}
    </div>
  );
};
