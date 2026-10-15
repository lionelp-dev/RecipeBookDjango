export function csrfHeaders(): Record<string, string> {
  const token = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith("csrftoken="))
    ?.slice("csrftoken=".length);

  return token ? { "X-CSRFToken": decodeURIComponent(token) } : {};
}
