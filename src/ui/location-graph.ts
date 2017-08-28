import { StringType } from '../check';
import { Graph, staticId } from '../graph';
import { Locations } from '../ui/locations';

export const $location = {
  path: staticId('path', StringType),
};
export function providesPath(): string {
  return Locations.normalizePath(window.location.hash.substr(1));
}
Graph.registerProvider($location.path, false, providesPath);

window.addEventListener('hashchange', () => {
  Graph.refresh($location.path);
});

