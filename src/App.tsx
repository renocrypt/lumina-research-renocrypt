import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryForm } from "./components/QueryForm";
import { Badge } from "@/components/ui/badge";
import { ResultsList } from "./components/ResultsList";
import { RecentSearches } from "./components/RecentSearches";
import { HeroSection } from "./components/HeroSection";
import { ThemeToggle } from "./components/ThemeToggle";
import { Footer } from "./components/Footer";
import { Archive, Database, AlertTriangle } from "lucide-react";
import { ArticleProvider, useArticleContext } from "./contexts/ArticleContext";

function AppContent() {
  const {
    articles,
    loading,
    error,
    recentSearches,
    activeTab,
    setActiveTab,
    loadPastSearch,
  } = useArticleContext();

  const handleSelectRecentSearch = (query: string, source: string) => {
    setActiveTab(source as "arxiv" | "openalex" | "semantic-scholar");
    loadPastSearch(query, source as "arxiv" | "openalex" | "semantic-scholar");
  };

  return (
    <div className="container mx-auto py-8 min-h-screen flex flex-col">
      <ThemeToggle />
      <HeroSection />

      <Tabs
        value={activeTab}
        onValueChange={(value: string) =>
          setActiveTab(value as "semantic-scholar" | "arxiv" | "openalex")
        }
        className="mb-6"
      >
        <TabsList>
          <div className="relative">
            <Badge
              variant="destructive"
              className="absolute -top-4 left-1/4 transform -translate-x-1/2 z-10"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Unstable
            </Badge>
            <TabsTrigger value="semantic-scholar">Semantic Scholar</TabsTrigger>
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

      <QueryForm />

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

export default function App() {
  return (
    <ArticleProvider>
      <AppContent />
    </ArticleProvider>
  );
}
