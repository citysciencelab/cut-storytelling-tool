const md = require("markdown-it")(),
    fs = require("fs"),
    path = require("path"),
    {exit} = require("process"),
    documentationSource = "doc",
    documentationTarget = "docHtml";

/**
 * Implements bitbucket's [TOC] feature for markdown.
 * @param {string} html html with [TOC] mark
 * @returns {string} [TOC] replaced with table of contents
 */
function buildTableOfContents (html) {
    const headers = [
        ...html
            .matchAll(/<h([1-6]) id="(markdown-header-\w+)">([\w\s\-.()]+)<\/h[1-6]>/g)
    ]
        .map(hit => ({
            depth: hit[1],
            href: `#${hit[2]}`,
            text: hit[3]
        }));

    let tableOfContents = "<h1>Table of Contents</h1>",
        lastDepth = 0;

    while (headers.length) {
        const {depth, href, text} = headers.shift(),
            levelDifference = depth - lastDepth,
            levelDifferenceAbsolute = Math.abs(levelDifference);

        if (levelDifference !== 0) {
            for (let i = 0; i < levelDifferenceAbsolute; i++) {
                tableOfContents +=
                    levelDifference > 0
                        ? "<ul>"
                        : "</li></ul>";
            }
        }
        else {
            tableOfContents += "</li>";
        }

        tableOfContents += `<li><a href="${href}">${text}</a>
        `;

        lastDepth = depth;
    }

    for (let i = 0; i < lastDepth; i++) {
        tableOfContents += "</ul></li>";
    }

    return html.replace("[TOC]", tableOfContents);
}

/**
 * Adds anchors as implemented by bitbucket markdown preview.
 * @param {string} html html without anchors
 * @returns {string} html with anchors
 */
function addAnchors (html) {
    let counter = 0;
    const seen = [];

    return html
        .replace(
            // strict lowercase all to avoid misses
            /<a href="#([\w-]+)">/g,
            (_, p1) => `<a href="#${p1.toLowerCase()}">`
        )
        .replace(
            /(<h[1-6])>([\w\s.\-()]+)(<\/h[1-6]>)/g,
            (_, p1, p2, p3) => {
                let key = `markdown-header-${
                    p2
                        .replaceAll(/[.\s\-()]/g, "")
                        .toLowerCase()}`;

                // can't use anchor key twice - take notes, increment as needed
                if (seen.includes(key)) {
                    key += `${counter++}`;
                }
                seen.push(key);

                return `${p1} id="${key}">${p2}${p3}`;
            }
        );
}

/**
 * Translates markdown, adds bitbucket markdown features.
 * @param {string} data markdown file contents
 * @returns {string} html version of markdown
 */
function mdTranslator (data) {
    // convert to html;
    let html = md.render(data);

    // replace links – linking to .html, not .md anymore
    html = html.replace(
        /(<a href="[\w.-]+).md(">)/g,
        "$1.html$2"
    );

    html = addAnchors(html);

    // TOC is a bitbucket feature; reconstruct if indicated
    if (html.includes("[TOC]")) {
        html = buildTableOfContents(html);
    }

    // add html context, add MIT-licensed classless css
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>📚Masterportal Docs</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
                <style>
                    body {
                        max-width: 1200px;
                    }
                    table {
                        table-layout: auto;
                    }
                </style>
            </head>
            <body>
                ${html}
            </body>
        </html>`;
}

/**
 * @param {String} source source directory of documentation
 * @param {String} target target directory to compile to
 * @returns {void}
 */
function recursiveBuilder (source, target) {
    // create current nesting level as folder
    fs.mkdirSync(target, {recursive: true});

    fs.readdir(source, {withFileTypes: true}, function (err, files) {
        if (err) {
            console.error(
                `Error on reading documentation source directory "${source}".`,
                err
            );
            exit(1);
        }

        files.forEach((file) => {
            const sourcePath = path.join(source, file.name);
            let targetPath = path.join(target, file.name),
                data;

            if (file.isFile()) {
                if (file.name.endsWith(".md")) {
                    targetPath = targetPath.replace(/\.md$/, ".html");
                    data = fs.readFileSync(sourcePath, {encoding: "utf8"});
                    data = mdTranslator(data);
                }
                else {
                    data = fs.readFileSync(sourcePath);
                }
                fs.writeFileSync(targetPath, data);
            }
            else if (file.isDirectory()) {
                recursiveBuilder(sourcePath, targetPath);
            }
            else {
                console.error(
                    `Unexpected file "${sourcePath}" not handled. Skipping ...`,
                    err
                );
            }
        });
    });
}


// clean up target folder, build fresh docs
fs.rmSync(documentationTarget, {recursive: true, force: true});
recursiveBuilder(documentationSource, documentationTarget);
