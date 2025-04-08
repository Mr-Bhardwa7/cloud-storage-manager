import Bowser from "bowser";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

const getUserIPAddress = (headersList: ReadonlyHeaders) => {
   return (headersList.get("x-forwarded-for") || // Proxy headers (Cloudflare, Vercel, AWS)
          headersList.get("cf-connecting-ip") || // Cloudflare specific
          headersList.get("x-real-ip") || // Nginx reverse proxy
          headersList.get("x-vercel-ip") || // Vercel's provided IP
          headersList.get("forwarded")?.split(";")[0].split("=")[1] || // Generic Forwarded header
          "Unknown");
}

export const getDeviceInfo = (headersList: ReadonlyHeaders) => {
  try {
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const ip = getUserIPAddress(headersList);
    const browser = Bowser.getParser(userAgent);

    return {
      browserName: browser.getBrowserName(),
      browserVersion: browser.getBrowserVersion(),
      osName: browser.getOSName(),
      osVersion: browser.getOSVersion(),
      platformType: browser.getPlatformType(),
      fullUserAgent: userAgent,
      ip
    };
  } catch (error) {
    console.error("Error parsing user agent:", error);
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const ip = getUserIPAddress(headersList);
    return {
      browserName: "Unknown",
      browserVersion: "Unknown",
      osName: "Unknown",
      osVersion: "Unknown",
      platformType: "Unknown",
      fullUserAgent: userAgent,
      ip
    };
  }
};