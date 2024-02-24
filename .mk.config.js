declare({
  name: 'link',
  as: shell({
    bin: 'npm',
    flags: [
      'link',
      ...'gs-testing gs-types nabu moirai santa devbase'.split(' '),
    ],
  }),
});

declare({
  name: 'docs',
  as: serial({
    cmds: [
      shell({bin: 'webpack', flags: '--config-name docs'.split(' ')}),
      shell({bin: 'api-extractor', flags: 'run --local --verbose'.split(' ')}),
      shell({
        bin: 'thoth',
        flags: '--assets=./docassets --outdir=../thoth/run/gs-tools --project=gs-tools'.split(' '),
      }),
    ],
  }),
});
