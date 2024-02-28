load('node_modules/devbase/.mk.config-base.js');
load('node_modules/devbase/ts/.mk.config-base.js');

set_vars({
  vars: {
    local_deps: [
      'devbase',
      'gs-testing',
      'gs-types',
      'moirai',
      'nabu',
      'santa',
    ],
  },
});

declare({
  name: 'docs',
  as: serial({
    cmds: [
      shell({bin: 'webpack', flags: '--config-name docs'.split(' ')}),
      shell({
        bin: 'api-extractor',
        flags: 'run --local --verbose'.split(' '),
      }),
      shell({
        bin: 'thoth',
        flags:
          '--assets=./docassets --outdir=../thoth/run/gs-tools --project=gs-tools'.split(
            ' ',
          ),
      }),
    ],
  }),
});
