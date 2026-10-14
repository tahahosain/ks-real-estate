function formatPrice(price) {
  if (price === undefined || price === null || price === "") {
    return "توافقی";
  }

  return Number(price).toLocaleString("fa-IR");
}

export { formatPrice };