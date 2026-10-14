import { useQuery } from "@tanstack/react-query";
import { getEstates } from "@/utiles/estateService";

export default function useEstates({ filters, page }) {
  return useQuery({
    queryKey: ["estates", filters, page],

    queryFn: () =>
      getEstates({
        filters,
        page,
      }),
  });
}
