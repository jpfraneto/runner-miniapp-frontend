import sdk from '@farcaster/frame-sdk';

/**
 * Checks if the current environment is a Farcaster miniapp
 * by attempting to initialize the SDK and check for user context availability
 */
export async function isFarcasterMiniapp(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    await sdk.actions.ready();
    const context = await sdk.context;
    return Boolean(context?.user);
  } catch (error) {
    return false;
  }
}

/**
 * Checks if the app is running in a mobile browser
 */
export function isMobileBrowser(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
}