# SSR remote entry imports the top-level config's hostInit under the Vite 8 builder

Reproduction for `@module-federation/vite` 1.23.6 with Vite 8.2.0.

A container with `exposes` and `remotes`, built with `builder: {}` (client and ssr environments) from a config file. Since 1.23.6 the SSR remote entry imports `hostInitPromise` from the hostInit of the first `federation()` call (`__mf_owner__1`). With `sharedConfigBuild: false` (the default) each environment evaluates the config file again and gets its own `federation()` instance, so no environment resolves `virtual:mf-localSharedImportMap:…__mf_owner__1`.

```sh
npm install
npm run build                            # fails
npm run build:shared-config              # builds: builder.sharedConfigBuild = true
npm run build:ssr-entry-per-environment  # builds: diagnostic, mf:ssr-remote-entry not sharedDuringBuild
```

`npm run build` fails with:

```
Error: [vite]: Rolldown failed to resolve import "virtual:mf-localSharedImportMap:__mfe_internal__panel_app__mf_owner__1" from " virtual:mf:__mfe_internal__panel_app__mf_owner__1__H_A_I__hostAutoInit__H_A_I__.js".
```

The same project builds with `@module-federation/vite` 1.23.5.

Fix: https://github.com/module-federation/vite/pull/1518
