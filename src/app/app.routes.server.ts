import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'open-product/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [{ id: 'demo-product' }]
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
