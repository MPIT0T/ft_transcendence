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

        let username = null;
        let fileBuffer = null;
        let detectedExt = null;

        const mp = await req.parts();

        for await (const part of mp) {

            if (part.type === "field") {
                if (part.fieldname === "username") {
                    username = part.value;
                }
                continue;
            }

            if (part.type === "file") {

                if (!part.mimetype.startsWith("image/")) {
                    return reply.code(400).send({ error: "Filetype expected: PNG, JPEG, GIF, WEBP" });
                }

                const chunks = [];
                let header = null;

                for await (const chunk of part.file) {
                    if (!header) header = chunk.slice(0, 12);
                    chunks.push(chunk);
                }

                fileBuffer = Buffer.concat(chunks);

                detectedExt = isValidImageMagic(header);
                if (!detectedExt)
                    return reply.code(400).send({ error: "Corrupted file or not an image file" });

                if (fileBuffer.length > 800 * 1024)
                    return reply.code(400).send({ error: "File is limited to 800 KB" });
            }
        }

        if (!username)
            return reply.code(400).send({ error: "Username is required" });

        if (!fileBuffer)
            return reply.code(400).send({ error: "Image file is required" });

        const res = await fetch('https://user_handling:3003/api/check-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers['authorization'] || ""
            },
            body: JSON.stringify({ username }),
        });

        if (!res.ok)
            return reply.code(401).send({ error: "Unauthorized" });

        let metadata;
        try {
            metadata = await sharp(fileBuffer).metadata();
        } catch {
            return reply.code(400).send({ error: "Cannot read image file" });
        }

        if (metadata.width !== 500 || metadata.height !== 500)
            return reply.code(400).send({ error: "Must be 500×500" });

        const folderPath = path.join(__dirname, 'avatars');
        const finalFilename = `${username}.${detectedExt}`;
        const uploadPath = path.join(folderPath, finalFilename);

        const files = await fs.promises.readdir(folderPath);
        for (const file of files) {
            if (path.parse(file).name === username && file !== finalFilename) {
                await fs.promises.unlink(path.join(folderPath, file));
            }
        }

        await fs.promises.writeFile(uploadPath, fileBuffer);
        
        return reply.send({
            success: true,
            username,
            fileUrl: "/avatars/" + finalFilename
        });
    });
}

module.exports = uploadAvatarRoute;
