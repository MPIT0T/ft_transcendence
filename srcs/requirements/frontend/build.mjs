import esbuild from 'esbuild';

const isDev = process.env.BUILD_MODE === "dev";

const rebuildLogger = {
    name: 'rebuild-logger',
    setup(build) {
        build.onStart(() => {
            console.log(`Rebuilding at ${new Date().toLocaleTimeString()}...`);
        });
        build.onEnd((result) => {
            if (result.errors.length) {
                console.error(`Build failed with ${result.errors.length} erros(s).`);
            } else {
                console.log(`Build succeeded with ${result.warnings.length} warning(s).`);
            }
        });
    },
};

async function buildJS() {
    if (isDev) {
        const ctx = await esbuild.context({
            entryPoints: ["src/main.ts"],
            bundle: true,
            outfile: "dist/bundle.js",
            sourcemap: true,
            loader: { '.ttf': 'file', },
            plugins: [rebuildLogger],
        });
        await ctx.watch();
        console.log("Watching for changes...");
    }
    else {
        await esbuild.build({
            entryPoints: ["src/main.ts"],
            bundle: true,
            outfile: "dist/bundle.js",
            sourcemap: false,
            minify: true,
            loader: { '.ttf': 'file', },
        });
        console.log("Build complete.");
    }
}

async function main() {
    await buildJS();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
