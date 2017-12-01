// generated on <%= date %> using <%= name %> <%= version %>

var fileinclude = require('gulp-include-inline'),
  gulp = require('gulp'),
  nunjucks = require('nunjucks'),
  fs = require('fs'),
  connect = require('gulp-connect'),
  htmlInlineAutoprefixer = require("gulp-inline-autoprefixer"),
  htmlInline = require('gulp-html-inline'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-ruby-sass'),
  cssBase64 = require('gulp-css-base64'),
  jade = require('gulp-jade'),
  imagemin = require('gulp-imagemin'),
  inlinesource = require('gulp-inline-source'),
  path = require('path'),
  static = require('serve-static'),
  rename = require('gulp-rename'),
  through2 = require('through2'),
  inlineImages = require('gulp-inline-images'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  concatCss = require('gulp-concat-css'),
  concat = require('gulp-concat');
  
var pkg = require('./package.json');
var $ = gulpLoadPlugins();
var dev = true;

// 为nunjucks添加jinja的过滤器
var env = new nunjucks.Environment();
env.addFilter('safe', function(str) {
  return str;
});
env.addFilter('lower', function(str) {
  return ('' + str).toLocaleLowerCase();
});

// 生成html文件本地调试,可本地测试jinja模板，watch所有文件变化
gulp.task('html', ['js', '<%= includeSass ? 'scss' : 'css' %>'], function () {
  return gulp.src(['app/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@root'
    }))
    .pipe(inlinesource({
      'rootpath': 'dist',
      'compress': false
    }))
    .pipe(htmlInlineAutoprefixer({ browsers: ['ios 7', 'Android 4.3'] }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

// 处理压缩图片
gulp.task('imgs', function () {
  return gulp.src(['app/imgs/*', 'app/imgs/**/*'])
    .pipe(imagemin())
    .pipe(gulp.dest('dist/imgs'));
});

// 拼接所有业务脚本
gulp.task('js', function () {
  return gulp.src(['app/js/*.js'])
    .pipe(concat('index.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload());
});

<% if (includeSass) { -%>
// 处理sass
gulp.task('scss', ['imgs'], function () {
  return sass(['app/scss/index.scss'])
    .pipe(autoprefixer({ browsers: ['ios 7', 'Android >= 4'] }))
    .pipe(cssBase64({
      baseDir: '../dist',
      maxWeightResource: 10000,
      extensionsAllowed: ['.gif', '.png', '.jpg']
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});
<% } -%>


<% if (!includeSass) { -%>
gulp.task('css', () => {
  return gulp.src('app/styles/*.css')
    .pipe(autoprefixer({browsers: ['ios 7', 'Android >= 4']}))
    .pipe(concatCss("dist/css"))
    .pipe(connect.reload());
});
<% } -%>

// 开发环境启动
gulp.task('dev', ['html', '<%= includeSass ? 'scss' : 'css' %>', 'js'], function () {
  gulp.watch(["<%= includeSass ? 'app/scss/*.scss' : 'app/css/*.css' %>"], ['html']);
  gulp.watch(['app/js/*.js', 'app/js/**/*.js'], ['html']);
  gulp.watch(['app/imgs/*'], ['imgs']);
  gulp.watch(['app/*.html', 'app/tpl/*.tpl'], ['html']);
  connect.server({
    root: ['dist'],
    port: 8001,
    livereload: true,
    middleware: function (connect, connectApp) {
      return [jinjaRender(), static('./dist')]
    }
  });
});

// 生成可用jinja2模板
gulp.task('proc', ['js', '<%= includeSass ? 'scss' : 'css' %>', 'imgs'], function () {
  dev = false;
  return gulp.src(['app/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@root'
    }))
    .pipe(inlinesource({
      'rootpath': 'dist',
      'compress': true
    }))
    .pipe(htmlInlineAutoprefixer({ 'browsers': ['ios 7', 'Android >= 4'] }))
    .pipe(rename(pkg.name + '.html'))
    .pipe(gulp.dest('dist/release'))
});


// connect中间件，解析jinja模板生成可预览html
function jinjaRender(options) {
  options = options || {};
  return function jinjaRender(req, res, next) {
    var _path = req.url;
    var root = options.root || 'dist';
    var filePath = path.join(root, path.dirname(_path), path.basename(_path) || 'index.html');
    var dataPath = options.dataPath || path.join(__dirname, 'app/data.json');
    try {
      if (fs.lstatSync(filePath).isDirectory() || filePath.indexOf('.html') <= 0) {
        // 如果不是html文件, 略过
        next();
        return;
      }
      var readstream = fs.createReadStream(filePath);
      readstream.pipe(through2(function (chunk, enc, callback) {
        var file = '', content = '', data = {};
        try {
          data = JSON.parse(fs.readFileSync(path.resolve(dataPath)));
          content = new Buffer(chunk).toString();
          file = env.renderString(content, data);
        } catch (e) {
          file = content;
          console.log(e);
        }
        this.push(file);
        callback();
      })).pipe(res);
    } catch (e) {
      console.log(e)
    }
    next();
  }
}

