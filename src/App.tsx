import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryForm } from "./components/QueryForm";
import { Badge } from "@/components/ui/badge";
import { ResultsList } from "./components/ResultsList";
import { RecentSearches } from "./components/RecentSearches";
import { HeroSection } from "./components/HeroSection";
import { ThemeToggle } from "./components/ThemeToggle";
import { Footer } from "./components/Footer";
import { useArticleSearch } from "./hooks/useArticleSearch";
import { Archive, Database, Lock } from "lucide-react";
import { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("arxiv");
  const {
    articles,
    loading,
    error,
    searchArticles,
    recentSearches,
    hasMore,
    loadMoreArticles,
  } = useArticleSearch();

  const handleSearch = (query: string, isLoadMore: boolean) => {
    if (isLoadMore) {
      loadMoreArticles();
    } else {
      searchArticles(query, activeTab as "arxiv" | "openalex");
    }
  };

  const handleSelectRecentSearch = (query: string, source: string) => {
    if (source !== "semantic-scholar") {
      setActiveTab(source as "arxiv" | "openalex");
      searchArticles(query, source as "arxiv" | "openalex");
    }
  };

  return (
    <div className="container mx-auto py-8 min-h-screen flex flex-col">
      <ThemeToggle />
      <HeroSection />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <div className="relative">
            <Badge
              variant="destructive"
              className="absolute -top-4 left-1/4 transform -translate-x-1/2 z-10"
            >
              Coming Soon
            </Badge>
            <TabsTrigger
              value="semantic-scholar"
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              <Lock className="mr-2 h-4 w-4" />
              Semantic Scholar
            </TabsTrigger>
          </div>
          <TabsTrigger value="arxiv">
            <Archive className="mr-2 h-4 w-4" />
            arXiv
          </TabsTrigger>
          <TabsTrigger value="openalex">
            <Database className="mr-2 h-4 w-4" />
            OpenAlex
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {recentSearches.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Recent Searches</h2>
          <RecentSearches
            searches={recentSearches}
            onSelectSearch={handleSelectRecentSearch}
          />
        </div>
      )}

      <QueryForm
        onSearch={handleSearch}
        isLoading={loading}
        hasMore={hasMore}
        articles={articles}
      />

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2 text-sm">
            Please check the console for more details.
          </p>
        </div>
      )}
      <ResultsList articles={articles} isLoading={loading} />

      <div className="flex-grow"></div>

      <Footer />
    </div>
  );
}
