import { useState, useEffect, useRef } from "react";
import { Plus, Search } from "lucide-react";
import {
  Link,
  useLoaderData,
  useFetcher,
  useNavigate,
  useLocation,
} from "react-router";
import { Button } from "~/client/components/ui/button";
import { Empty } from "~/client/components/ui/empty";
import { FolderOpen } from "lucide-react";
import { Input } from "~/client/components/ui/input";
import type { CampaignsLoader } from "~/client/types/campaignsLoader";
import { CampaignCard } from "./components/campaignCard";

function MyCampaignsPage() {
  const { campaigns } = useLoaderData<CampaignsLoader>();
  const fetcher = useFetcher<CampaignsLoader>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParam = new URLSearchParams(location.search).get("search") ?? "";
  const [localSearch, setLocalSearch] = useState(searchParam);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [extraItems, setExtraItems] = useState(campaigns.data.slice(0, 0));
  const [meta, setMeta] = useState(campaigns.meta);

  useEffect(() => {
    setLocalSearch(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setExtraItems([]);
    setMeta(campaigns.meta);
  }, [campaigns]);

  useEffect(() => {
    if (!fetcher.data) return;
    setExtraItems((prev) => [...prev, ...fetcher.data!.campaigns.data]);
    setMeta(fetcher.data!.campaigns.meta);
  }, [fetcher.data]);

  const items = [...campaigns.data, ...extraItems];
  const hasMore = meta.page < meta.totalPages;
  const isLoading = fetcher.state !== "idle";

  function handleSearchChange(value: string) {
    setLocalSearch(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    const next = new URLSearchParams(location.search);
    if (!value) {
      next.delete("search");
      navigate(`?${next.toString()}`, { preventScrollReset: true });
      return;
    }
    if (value.length >= 3) {
      searchTimerRef.current = setTimeout(() => {
        next.set("search", value);
        navigate(`?${next.toString()}`, { preventScrollReset: true });
      }, 400);
    }
  }

  function loadMore() {
    const next = new URLSearchParams();
    next.set("campaigns:page", String(meta.page + 1));
    next.set("skipPendingInvites", "true");
    const currentSearch = new URLSearchParams(location.search).get("search");
    if (currentSearch) next.set("search", currentSearch);
    fetcher.load(`/my-campaigns?${next.toString()}`);
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Campanhas
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie e acompanhe o progresso de todas as campanhas.
          </p>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Button asChild className="shrink-0 gap-2">
            <Link to="create">
              <Plus size={18} />
              Nova campanha
            </Link>
          </Button>
        </div>
      </header>

      {items.length === 0 ? (
        <Empty.Root>
          <Empty.Header>
            <Empty.Media variant="icon">
              <FolderOpen />
            </Empty.Media>
            <Empty.Title>Nenhuma campanha cadastrada</Empty.Title>
          </Empty.Header>
          <Empty.Content>
            <Button asChild>
              <Link to="create">Criar campanha</Link>
            </Button>
          </Empty.Content>
        </Empty.Root>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={loadMore} disabled={isLoading}>
                {isLoading ? "Carregando..." : "Carregar mais"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export { MyCampaignsPage };
