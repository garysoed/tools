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

function getPath(): string {
  return Locations.normalizePath(window.location.hash.substr(1));
}

const pathProvider = Graph.createProvider($location.path, getPath());
window.addEventListener('hashchange', () => {
  pathProvider(getPath());
});

