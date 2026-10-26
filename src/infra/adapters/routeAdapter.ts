import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

class RouteAdapter {
  static async adaptRoute({
    params,
    request,
  }: LoaderFunctionArgs | ActionFunctionArgs) {
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    // O CRM retorna o contato criado/editado via "redirectBack" usando o parâmetro
    // "contactId", mas as páginas deste painel esperam "contactPublicId". Usamos um
    // como alias do outro aqui para que loaders/controllers não precisem duplicar essa checagem.
    if (!query.contactPublicId && query.contactId) {
      query.contactPublicId = query.contactId;
    }

    return {
      request: request,
      params: params as Record<string, string>,
      query,
    };
  }
}

export { RouteAdapter };
