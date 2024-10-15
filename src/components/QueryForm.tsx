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
import { Search } from "lucide-react";

interface QueryFormProps {
  onSearch: (query: string) => void;
}

export const QueryForm: React.FC<QueryFormProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(`${query}&sort=${sortBy}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-4 items-end">
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
      <Button type="submit">
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
};
