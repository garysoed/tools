import { StringType } from '../check';
import { Graph, staticId } from '../graph';
import { Locations } from '../ui/locations';
import { Log } from '../util';

const LOGGER = Log.of('gs-tools.ui.LocationGraph');

export const $location = {
  path: staticId('path', StringType),
};

export function navigateToHash(path: string): void {
  Log.debug(LOGGER, `Going to ${path}`);
  window.location.hash = Locations.normalizePath(path);
}

export function providesPath(): string {
  return Locations.normalizePath(window.location.hash.substr(1));
}
Graph.registerProvider($location.path, providesPath);

window.addEventListener('hashchange', () => {
  Graph.refresh($location.path);
});

