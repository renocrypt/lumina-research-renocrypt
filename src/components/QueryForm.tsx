import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";

interface QueryFormProps {
  onSearch: (query: string, isLoadMore: boolean) => void;
  isLoading: boolean;
  hasMore: boolean;
}

export const QueryForm: React.FC<QueryFormProps> = ({
  onSearch,
  isLoading,
  hasMore,
}) => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, false);
  };

  const handleLoadMore = () => {
    onSearch(query, true);
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
        <Button type="submit" disabled={isLoading}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>
      {hasMore && (
        <Button
          onClick={handleLoadMore}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Load More
        </Button>
      )}
    </div>
  );
};
