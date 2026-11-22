export const workspaceRoutePattern = /^\/(?:card|events(?:\/new)?|join)\/?$/;
export const eventCodePattern = /^[A-Za-z0-9]{20}$/;

export type WorkspacePage = '/card' | '/events' | '/events/new' | '/join';

export function readRoute(url: URL) {
  const path = url.pathname.replace(/\/$/, '');
  const page: WorkspacePage = path === '/events' || path === '/events/new' || path === '/join' ? path : '/card';
  const code = url.searchParams.get('event') ?? '';
  return { page, eventId: eventCodePattern.test(code) ? code : '' };
}

export const pageTitles = {
  '/card': 'Participation card',
  '/events': 'Your events',
  '/events/new': 'Create an event',
  '/join': 'Join an event',
};

export function eventPath(eventId: string) {
  return '/events?event=' + encodeURIComponent(eventId);
}
