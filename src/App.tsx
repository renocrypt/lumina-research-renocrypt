import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryForm } from "./components/QueryForm";
import { ResultsList } from "./components/ResultsList";
import { RecentSearches } from "./components/RecentSearches";
import { HeroSection } from "./components/HeroSection";
import { useArticleSearch } from "./hooks/useArticleSearch";
import { Search, Archive, Database } from "lucide-react";
import { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("semantic-scholar");
  const { articles, loading, error, searchArticles, recentSearches } =
    useArticleSearch();

  const handleSearch = (query: string) => {
    searchArticles(
      query,
      activeTab as "semantic-scholar" | "arxiv" | "openalex"
    );
  };

  const handleSelectRecentSearch = (query: string, source: string) => {
    setActiveTab(source);
    searchArticles(query, source as "semantic-scholar" | "arxiv" | "openalex");
  };

  return (
    <div className="container mx-auto py-8">
      <HeroSection />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="semantic-scholar">
            <Search className="mr-2 h-4 w-4" />
            Semantic Scholar
          </TabsTrigger>
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

      <QueryForm onSearch={handleSearch} />

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2 text-sm">
            Please check the console for more details.
          </p>
        </div>
      )}
      {articles && <ResultsList articles={articles} />}
    </div>
  );
}