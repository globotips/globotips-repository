export function staffJoinOnboardingUrls(origin: string, token: string) {
  const base = origin.replace(/\/$/, "");
  const encoded = encodeURIComponent(token);
  return {
    returnUrl: `${base}/join/${encoded}?stripe=return`,
    refreshUrl: `${base}/join/${encoded}/refresh`,
  };
}

export function hotelAdminOnboardingUrls(origin: string, employeeId: string) {
  const base = origin.replace(/\/$/, "");
  const encoded = encodeURIComponent(employeeId);
  return {
    returnUrl: `${base}/admin/connect/return?employee=${encoded}`,
    refreshUrl: `${base}/admin/connect/refresh?employee=${encoded}`,
  };
}
