import React, { createContext, useContext, ReactNode } from "react";
import { useArticleSearch } from "@/hooks/useArticleSearch";
import { Article } from "@/types/types";

interface ArticleContextType {
  articles: Article[];
  loading: boolean;
  error: string | null;
  searchArticles: (
    query: string,
    source: "semantic-scholar" | "arxiv" | "openalex"
  ) => void;
  recentSearches: { query: string; source: string; timestamp: number }[];
  hasMore: boolean;
  loadMoreArticles: () => void;
  activeTab: "semantic-scholar" | "arxiv" | "openalex";
  setActiveTab: (tab: "semantic-scholar" | "arxiv" | "openalex") => void;
  loadPastSearch: (
    query: string,
    source: "semantic-scholar" | "arxiv" | "openalex"
  ) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const articleSearch = useArticleSearch();
  const [activeTab, setActiveTab] = React.useState<
    "semantic-scholar" | "arxiv" | "openalex"
  >("arxiv");

  const value: ArticleContextType = {
    ...articleSearch,
    activeTab,
    setActiveTab,
  };

  return (
    <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>
  );
};

export const useArticleContext = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error("useArticleContext must be used within an ArticleProvider");
  }
  return context;
};
