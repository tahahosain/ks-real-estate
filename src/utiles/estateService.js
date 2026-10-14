

async  function   getEstates ({ filters, page = 1 }) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== "" &&
      value !== null &&
      value !== undefined &&
      value !== false
    ) {
      params.set(key, value);
    }
  });

  params.set("page", page);
  params.set("limit", 6);

  const response = await fetch(`/api/estates?${params.toString()}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "خطا در دریافت املاک");
  }

  return result;
}
//////////////////////// 



export { getEstates };