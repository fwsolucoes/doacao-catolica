import { useLocation, useNavigate } from "react-router";
import { useScopedParams } from "~/lib/scopedParams";

function useFilter(scope: string) {
  const navigate = useNavigate();
  const location = useLocation();

  const { getParam, getScopedSearch } = useScopedParams(location.search, scope);

  function handlePageChange(page: number) {
    navigate(getScopedSearch({ page }));
  }

  function handleClearFilters() {
    navigate(location.pathname);
  }

  let searchTimeout: NodeJS.Timeout;
  function handleChangeTimeoutFilter(filterName: string, value: string) {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      if (value === "") {
        navigate(getScopedSearch({ [filterName]: undefined, page: 1 }));
        return;
      }
      navigate(getScopedSearch({ [filterName]: value, page: 1 }));
    }, 500);
  }

  function handleChangeFilter(filterName: string, value: string) {
    const scoped = getScopedSearch({
      [filterName]: value === "" ? undefined : value,
      page: 1,
    });
    navigate(scoped);
  }

  return {
    handlePageChange,
    handleChangeTimeoutFilter,
    handleChangeFilter,
    getParam,
    handleClearFilters,
  };
}

export { useFilter };
