import Bowser from "bowser";
import { NextRequest } from 'next/server';
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers as nextHeaders } from "next/headers";
// import geoip from 'geoip-lite'; 

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  appVersion: string;
  location: string;
  ip: string;
}

/**
 * Gets the user's IP address from various header fields
 */
const getUserIPAddress = (headersList: ReadonlyHeaders): string => {
  return (
    headersList.get("x-forwarded-for")?.split(',')[0] || // Proxy headers (Cloudflare, Vercel, AWS)
    headersList.get("cf-connecting-ip") || // Cloudflare specific
    headersList.get("x-real-ip") || // Nginx reverse proxy
    headersList.get("x-vercel-ip") || // Vercel's provided IP
    headersList.get("forwarded")?.split(";")[0].split("=")[1] || // Generic Forwarded header
    "Unknown"
  );
};

// /**
//  * Gets location information based on IP address
//  */
// const getLocationFromIP = (ip: string): string | null => {
//   try {
//     if (ip === "Unknown" || ip === "127.0.0.1" || ip.startsWith("192.168.")) {
//       return null;
//     }
    
//     const geo = geoip.lookup(ip);
//     if (geo) {
//       return `${geo.city ? geo.city + ', ' : ''}${geo.country}`;
//     }
//     return null;
//   } catch (error) {
//     console.error("Error getting location from IP:", error);
//     return null;
//   }
// };

/**
 * Gets detailed device information from request headers
 */
export const getDeviceInfo = (headersList: ReadonlyHeaders): DeviceInfo => {
  try {
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const ip = getUserIPAddress(headersList);
    
    const browser = Bowser.getParser(userAgent);
    const browserName = browser.getBrowserName();
    const osName = browser.getOSName();
    const platformType = browser.getPlatformType();
    const browserVersion = browser.getBrowserVersion();
    
    // Create unique device identifier
    const deviceId = Buffer.from(`${browserName}|${osName}|${platformType}|${ip}`).toString('base64');

    return {
      deviceId,
      deviceName: `${browserName} on ${osName}`,
      deviceType: platformType || 'desktop',
      browser: browserName || 'Unknown',
      os: osName || 'Unknown',
      appVersion: browserVersion || 'Unknown',
      location: 'n/a', // Can be enhanced with geoip lookup
      ip
    };
  } catch (error) {
    console.error("Error parsing user agent:", error);
    
    return {
      deviceId: 'unknown-device',
      deviceName: 'Unknown Device',
      deviceType: 'unknown',
      browser: 'Unknown',
      os: 'Unknown',
      appVersion: 'Unknown',
      location: 'n/a',
      ip: getUserIPAddress(headersList)
    };
  }
};

/**
 * Gets device info from Next.js headers() function
 */
export const getDeviceInfoFromRequest = async (): Promise<DeviceInfo> => {
  const headersList = await nextHeaders();
  return getDeviceInfo(headersList);
};

export function getTokenFromHeader(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

export function getDeviceFingerprint(req: NextRequest) {
  return req.headers.get('user-agent') + '|' +
         (req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || '');
}