import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface RecentSearchesProps {
  searches: {
    query: string;
    source: string;
    timestamp: number;
  }[];
  onSelectSearch: (query: string, source: string) => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSelectSearch,
}) => {
  const trimQuery = (query: string) => {
    return query.split("&")[0]; // This will return only the part before '&'
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // You can customize this format as needed
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {searches.map((search, index) => (
          <Card
            key={index}
            className="w-[250px] cursor-pointer"
            onClick={() => onSelectSearch(search.query, search.source)}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">
                {trimQuery(search.query)}
              </h3>
              <p className="text-sm text-muted-foreground">{search.source}</p>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(search.timestamp)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
