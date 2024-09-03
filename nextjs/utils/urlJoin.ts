export function urlJoin(...paths: string[]): string {
    return paths
      .map((path, index) => {
        if (index === 0) {
          // Ensure the first path starts with a single leading slash
          return path.replace(/\/+$/, '');
        } else {
          // Ensure all other paths start and end without slashes
          return path.replace(/^\/+|\/+$/g, '');
        }
      })
      .filter(Boolean)
      .join('/')
      .replace(/\/+/g, '/'); // Replace multiple slashes with a single slash
  }
  