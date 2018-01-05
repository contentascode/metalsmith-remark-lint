import { extname, join } from 'path';
import engine from 'unified-engine';
import vfile from 'vfile';
import remark from 'remark';
import report from 'vfile-reporter';

export default function metalsmithRemark(plugins) {
    return function(files, metal, done) {
        // const markdownFiles = Object.keys(files)
        //     .filter(file => extname(file) === '.md' || extname(file) === '.markdown')
        //     .map(file =>
        //         vfile({ path: join(metal._source, file), contents: files[file].contents, cwd: metal._directory })
        //     );
        // console.log('markdownFiles', markdownFiles);
        // engine(
        //     {
        //         processor: remark(),
        //         cwd: metal._directory,
        //         rcPath: join(metal._directory, '.remarkrc'),
        //         files: markdownFiles,
        //         // plugins,
        //         color: true,
        //         // quiet: true,
        //         reporter: 'pretty',
        //         reporterOptions: {
        //             pretty: true
        //         },
        //         output: false
        //     },
        //     err => {
        //         if (err) {
        //             throw err;
        //         }
        //         done();
        //     }
        // );

        Promise.all(
            Object.keys(files).map(file => {
                const extension = extname(file);
                if (extension !== '.md' && extension !== '.markdown') {
                    return true;
                }
                return engine(
                    {
                        processor: remark(),
                        cwd: metal._directory,
                        rcPath: join(metal._directory, '.remarkrc'),
                        files: [
                            vfile({
                                path: join(metal._source, file),
                                contents: files[file].contents,
                                cwd: metal._directory
                            })
                        ],
                        // plugins,
                        color: true,
                        quiet: true,
                        reporter: 'pretty',
                        reporterOptions: {
                            pretty: true
                        },
                        output: false
                    },
                    err => {
                        if (err) {
                            done(err);
                        }
                    }
                );
            })
        )
            .then(() => done())
            .catch(err => done(err));
    };
}
