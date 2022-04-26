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
    fs.mkdirSync(target, {recursive: true});
    fs.readdir(source, {withFileTypes: true}, function (err, files) {
        if (err) {
            console.error(
                `Error on reading documentation source directory "${source}".`,
                err);
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
                    data = md.render(data);
                    data = data.replace(
                        /(<a href="[\w.-]+).md(">)/g,
                        "$1.html$2"
                    );
                }
                else {
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
