const path = require('path');
const fs = require('fs');
const sass = require('node-sass');
const _ = require('lodash');
const marked = require('marked');

const srcDir = path.resolve(__dirname, 'src');
// const srcDir = path.resolve('../', 'src');

const buildAll = () => {

    const layouts = [];
    const styles = [];

    const indexTemplate = _.template(fs.readFileSync(path.resolve(srcDir, 'index.ejs'), 'utf8'));
    const previewTemplate = _.template(fs.readFileSync(path.resolve(srcDir, 'preview.ejs'), 'utf8'));

    fs.readdirSync(srcDir).forEach(name => {
      const dir = path.resolve(srcDir, name);
      if (fs.statSync(dir).isDirectory()) {
        // console.log('layout', name);
        const layoutFile = path.resolve(dir, 'layout.json');
        const templateFile = path.resolve(dir, 'template.ejs');
        const styleFile = path.resolve(dir, 'style.scss');
        const layout = JSON.parse(fs.readFileSync(layoutFile, 'utf8'));
        const template = fs.readFileSync(templateFile, 'utf8');
        const sassResult = sass.renderSync({ file: styleFile });
        const style = sassResult.css.toString('utf8');

        layout.template = template;
        layout.style = style;
        layouts.push(layout);
        styles.push(style);

        const cssFile = path.resolve(dir, 'style.css');
        fs.writeFileSync(cssFile, style);

        const previewFile = path.resolve(dir, 'index.html');
        fs.writeFileSync(previewFile, previewTemplate({ $markdown: marked, layout }));
      }
    });

    fs.writeFileSync(path.resolve(srcDir, 'all.json'), JSON.stringify(layouts, null, 2));
    fs.writeFileSync(path.resolve(srcDir, 'all.css'), styles.join('\n'));
    fs.writeFileSync(path.resolve(srcDir, 'index.html'), indexTemplate({ $markdown: marked, layouts }));

}


module.exports = {
    buildAll
}
