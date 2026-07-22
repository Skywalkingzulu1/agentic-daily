declare module 'devvit' {
  interface ServerOptions<Routes extends Record<string, any>> {
    routes: Array<{ path: string; handler: any }>;
  }
  class Server<Routes extends Record<string, any>> {
    routes: ServerOptions<Routes>['routes'];
  }
  function kv(context: any): {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    list(prefix: string): Promise<{ keys: { name: string }[] }>;
  };
  export { Server, kv };
}

declare module 'devvit/client' {
  interface RouteLogic {
    post?: any;
    user?: { username?: string };
  }
  function useRouteLogic(): RouteLogic;
  interface User {
    username?: string;
  }
  function useUser(): User;
  export { useRouteLogic, useUser };
}
