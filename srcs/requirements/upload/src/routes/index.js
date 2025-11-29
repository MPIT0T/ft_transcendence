'use strict';
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

function isValidImageMagic(buffer) {
    const png = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const jpg = Buffer.from([0xFF, 0xD8, 0xFF]);
    const gif = Buffer.from([0x47, 0x49, 0x46, 0x38]);
    const webp = Buffer.from([0x52, 0x49, 0x46, 0x46]); // "RIFF"

    if (buffer.slice(0, 8).equals(png)) return "png";
    if (buffer.slice(0, 3).equals(jpg)) return "jpg";
    if (buffer.slice(0, 4).equals(gif)) return "gif";
    if (buffer.slice(0, 4).equals(webp)) return "webp";

    return false;
}


async function uploadAvatarRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        let username;

        const mp = await req.multipart(handler);
        mp.on("field", (key, value) => {
            if (key === "username") username = value;
        });

        if (!username)
        {
            return reply.code(400).send({ error: "Username is required" });
        }
        const res = await fetch('https://user_handling:3003/api/check-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${req.headers['authorization']}`},
            body: JSON.stringify({username}),
        });
        if (!res.ok) {
            return reply.code(401).send({ error: "Unauthorized" });
        }
        async function handler(field, file, filename, encoding, mimetype) {
            if (!mimetype.startsWith("image/"))
                return reply.code(400).send({error: "Filetype expected: image in the following formats: PNG, JPEG, GIF, WEBP"});
            const chunks = [];
            let totalBytes = 0;

            for await (const chunk of file) {
                chunks.push(chunk);
                totalBytes += chunk.length;
                if (totalBytes >= 12) break;
            }

            const header = Buffer.concat(chunks);

            const detectedExt = isValidImageMagic(header);

            if (!detectedExt) {
                return reply.code(400).send({error: "Corrupted file or not an image file"});
            }

            const buffer = Buffer.concat(chunks.concat(await file.toBuffer()));
            const maxBytes = 800 * 1024;
            if (buffer.length > maxBytes) {
                return reply.code(400).send({ error: "File is limited to 800 KB" });
            }
            let metadata;
            try {
                metadata = await sharp(buffer).metadata();
            } catch (e) {
                return reply.code(400).send({ error: "Cant read image file" });
            }
            if (metadata.width !== 500 || metadata.height !== 500) {
                return reply.code(400).send({ error: "Must be in 500×500" });
            }
            const finalFilename = `${username}.${detectedExt}`;
            const uploadPath = path.join("avatars", finalFilename);
            await fs.promises.writeFile(uploadPath, buffer);

            mp.fileSaved = "/avatars/" + finalFilename;
            return reply.send({
                success: true,
                username,
                fileUrl: "/avatars/" + finalFilename
            });
        }
    });
}

module.exports = uploadAvatarRoute;