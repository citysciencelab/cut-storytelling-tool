const md = require("markdown-it")({
        linkify: true,
        typographer: true
    }),
    fs = require("fs"),
    path = require("path"),
    {exit} = require("process"),
    documentationSource = "doc",
    documentationTarget = "docHtml";

// clean up target folder
fs.rmSync(documentationTarget, {recursive: true, force: true});

/**
 * @param {String} source source directory of documentation
 * @param {String} target target directory to compile to
 * @returns {void}
 */
function recursiveBuilder (source = documentationSource, target = documentationTarget) {
    // create current nesting level as folder
    fs.mkdirSync(target, {recursive: true});

    fs.readdir(source, {withFileTypes: true}, function (err, files) {
        if (err) {
            console.error(
                `Error on reading documentation source directory "${source}".`,
                err);
            exit(1);
        }

        // for all files/folders
        files.forEach((file) => {
            const sourcePath = path.join(source, file.name);
            let targetPath = path.join(target, file.name),
                data;

            if (file.isFile()) {
                if (file.name.endsWith(".md")) {
                    // rename file
                    targetPath = targetPath.replace(/\.md$/, ".html");
                    // convert to html
                    data = fs.readFileSync(sourcePath, {encoding: "utf8"});
                    data = md.render(data);

                    // replace links – linkling to .html, not .md anymore
                    data = data.replace(
                        /(<a href="[\w.-]+).md(">)/g,
                        "$1.html$2"
                    );

                    // add anchors – they're a bitbucket-specific feature
                    data = data.replace(
                        /<a href="#([\w-]+)">/g,
                        (_, p1) => `<a href="#${p1.toLowerCase()}">`
                    );
                    data = data.replace(
                        /(<h[1-6])(>)([\w.]+)(<\/h[1-6]>)/g,
                        (_, p1, __, p3, p4) => `${p1} id="markdown-header-${p3.split(".").join("").toLowerCase()}">${p3}${p4}`
                    );

                    // add html context, add some MIT-licensed classless css
                    data = `
                        <!DOCTYPE html>
                        <html>
                            <head>
                                <meta charset="utf-8">
                                <title>📚Masterportal Docs</title>
                                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
                            </head>
                            <body>
                            ${data}
                            </body>
                        </html>`;

                    // build table of contents – maybe eventually, delete [TOC] for now
                    data = data.replace(
                        "[TOC]",
                        ""
                    );
                }
                else {
                    // just prepare all other file types for copying
                    data = fs.readFileSync(sourcePath);
                }
                fs.writeFileSync(targetPath, data);
            }
            else if (file.isDirectory()) {
                recursiveBuilder(sourcePath, targetPath);
            }
        });
    });

}

recursiveBuilder();
