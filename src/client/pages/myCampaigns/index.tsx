import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Link, useLoaderData, useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Empty } from "~/client/components/ui/empty";
import { FolderOpen } from "lucide-react";
import type { CampaignsLoader } from "~/client/types/campaignsLoader";
import { CampaignCard } from "./components/campaignCard";

function MyCampaignsPage() {
  const { campaigns } = useLoaderData<CampaignsLoader>();
  const fetcher = useFetcher<CampaignsLoader>();

  const [items, setItems] = useState(campaigns.data);
  const [meta, setMeta] = useState(campaigns.meta);

  useEffect(() => {
    if (!fetcher.data) return;
    setItems((prev) => [...prev, ...fetcher.data!.campaigns.data]);
    setMeta(fetcher.data!.campaigns.meta);
  }, [fetcher.data]);

  const hasMore = meta.page < meta.totalPages;
  const isLoading = fetcher.state !== "idle";

  function loadMore() {
    fetcher.load(
      `/my-campaigns?campaigns:page=${meta.page + 1}&skipPendingInvites=true`,
    );
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

        <Button asChild className="w-full gap-2 sm:w-auto">
          <Link to="create">
            <Plus size={18} />
            Nova campanha
          </Link>
        </Button>
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
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={isLoading}
              >
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
