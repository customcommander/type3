var
    // filesystem native module
    fs = require('fs'),

    // the result of yuidoc parsing the js files
    yuidoc = require(__dirname + '/../tmp/data.json'),

    // path to the file we will generate
    api_md_path = __dirname + '/../docs/api.md',

    // temporary buffer for writing stuffs into before writing the file itself
    api_md_out  = [],

    // end of line constants
    EOL  = "\n",
    EOL2 = EOL+EOL;

api_md_out.push('### API'+EOL2);

yuidoc.classitems
    .filter(function (item) {
        return item.access === 'public';
    })
    .forEach(function (item) {

        var method_sig = item.params || [];
        var examples   = item.example || [];

        method_sig =
            method_sig
                .map(function (param) {
                    return param.name;
                })
                .join(',');

        examples =
            examples
                .map(function (example) {
                    return '' +
                        '```javascript' + EOL +
                        example + EOL +
                        '```' + EOL2;

                })
                .join('');

        api_md_out.push('##### ' + '.' + item.name + '(' + method_sig + ')' + EOL2);
        api_md_out.push(item.description + EOL2);
        api_md_out.push(examples);
    });

api_md_out = api_md_out.join('');

fs.writeFileSync(api_md_path, api_md_out);
