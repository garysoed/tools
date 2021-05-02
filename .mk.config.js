declare({
  name: 'link',
  as: single({
    bin: 'npm',
    flags: [
      'link',
      ...'gs-testing gs-types dev nabu moirai santa devbase'.split(' '),
    ],
  }),
});

declare({
  name: 'docs',
  as: serial({
    cmds: [
      single({bin: 'webpack', flags: '--config-name docs'.split(' ')}),
      single({bin: 'api-extractor', flags: 'run --local --verbose'.split(' ')}),
      single({
        bin: 'thoth',
        flags: '--assets=./docassets --outdir=../thoth/run/gs-tools --project=gs-tools'.split(' '),
      }),
    ],
  }),
});
