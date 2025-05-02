// Client-side cookie utilities
export const deleteClientCookie = (name: string) => {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};