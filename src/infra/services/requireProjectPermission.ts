import { redirect } from "react-router";
import { PROJECT_ALL_PERMISSIONS } from "~/app/template/PROJECT_ALL_PERMISSIONS";
import { getCampaign } from "~/main/factories/campaign/getCampaignFactory";
import { getProjectPermissions } from "~/main/factories/projectPermissions/getProjectPermissionsFactory";
import type { RouteDTO } from "~/main/types/route";
import type { User } from "~/main/types/user";

type PermissionType = (typeof PROJECT_ALL_PERMISSIONS)[number];

const SUPER_USER_ID = "14692";

/**
 * Guarda de permissão para rotas 100% financeiras (ex.: Transferências,
 * Métricas Shalom) que não têm conteúdo não financeiro a preservar —
 * diferente do padrão usado no Dashboard, onde só partes da tela são
 * ocultadas via <Can>. Redireciona para o Dashboard da campanha quando a
 * permissão falta.
 */
async function requireProjectPermission(
  adaptedRoute: RouteDTO,
  user: User,
  permission: PermissionType,
) {
  const campaign = await getCampaign.handle(adaptedRoute);
  const isOwner = user.accountId === campaign.accountId;
  const isSuperUser = user.id === SUPER_USER_ID;

  const projectPermissions =
    isOwner || isSuperUser
      ? [...PROJECT_ALL_PERMISSIONS]
      : (await getProjectPermissions.handle(adaptedRoute, campaign.id))
          .projectPermissions;

  if (!projectPermissions.includes(permission)) {
    throw redirect(`/campaign/${campaign.id}/home?financialAccessDenied=true`);
  }

  return campaign;
}

export { requireProjectPermission };
