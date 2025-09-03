import esbuild from 'esbuild'

esbuild.build({
    entryPoints: ['src/main.ts'],   // entrypoint for the app
    bundle: true,                   // bundle everything in one
    outfile: 'dist/bundle.js',      // final file
    minify: true,                   // minify the JS
    sourcemap: false,               //
    format: 'esm',                  // ES6 module
    target: ['es2020'],             // modern browser compatibility
}).catch(err => {
    console.error(err);
    process.exit(1)
});
