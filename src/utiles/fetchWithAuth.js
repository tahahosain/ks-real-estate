const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // Access Token هنوز معتبر است
  if (response.status !== 401) {
    return response;
  }

  console.log("Access Token expired. Trying to refresh...");

  // گرفتن Access Token جدید
  const refreshResponse = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  const refreshResult = await refreshResponse.json();

  console.log("Refresh Result =>", refreshResult);

  // Refresh Token هم نامعتبر/منقضی شده
  if (!refreshResult.success) {
    return response;
  }

  // Access Token جدید ساخته شد
  // درخواست قبلی را دوباره اجرا می‌کنیم
  const retryResponse = await fetch(url, {
    ...options,
    credentials: "include",
  });

  return retryResponse;
};

export default fetchWithAuth;
