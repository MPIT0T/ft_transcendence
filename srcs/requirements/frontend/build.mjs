import esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'

const isDev = process.env.NODE_ENV === "dev"

function copyPublic() {
    const publicDir = "./public";
    const distDir = "./dist";

    fs.mkdirSync(distDir, {recursive: true});

    fs.readdirSync(publicDir).forEach(file => {
        fs.copyFileSync(
            path.join(publicDir, file),
            path.join(distDir, file)
        )
    });

    console.log("Static assets copied successfuly");
}

copyPublic();

if (isDev) {
    const ctx = await esbuild.context({
        entryPoints: ["src/main.ts"],
        bundle: true,
        outfile: "dist/bundle.js",
        sourcemap: true,
    });
    await ctx.watch();
    console.log("Watching for changes...");

} else {
    await esbuild.build({
        entryPoints: ["src/main.ts"],
        bundle: true,
        outfile: "dist/bundle.js",
        sourcemap: false,
        minify: true,
    });
    console.log("Build complete.")
};
