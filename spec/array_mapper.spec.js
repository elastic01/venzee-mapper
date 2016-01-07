'use strict';

describe('arrays in mapping', function () {

    let array_mapper = require('../lib/array_mapper.js');
    var _ = require('lodash');

    let mapping = {
        "title": "{{title}}",
        "images": [{
            "src": "{{image_url}}"
        }],
        "urls[*]": "{{images[*].url}}",
        "images[*]": {
            "src": "{{images[*].url}}"
        },
        "variants[*]": {
            "src": "{{variants[*].sku}}"
        }/*,
        "subObject": {
            "images[*]": {
                "src": "{{images[*].url}}"
            }
        }*/
    };

    let data = {
        images: [
            {url: 'url1'},
            {url: 'url2'}
        ],
        variants: [
            {sku: "sku1"},
            {sku: "sku2"},
            {sku: "sku3"}
        ]
    };

    let originalMapping = _.cloneDeep(mapping);

    it('array placeholders should be replaced by indexes 0,1,2...', function () {

        let result = array_mapper.iterateIndexes(mapping, data);
        expect(mapping).toEqual(originalMapping);
        expect(result).toEqual({
            "title": "{{title}}",
            "urls": [
                "{{images[0].url}}",
                "{{images[1].url}}"
            ],
            "images": [
                {"src": "{{image_url}}"},
                {"src": "{{images[0].url}}"},
                {"src": "{{images[1].url}}"}
            ],
            "variants": [
                {"src": "{{variants[0].sku}}"},
                {"src": "{{variants[1].sku}}"},
                {"src": "{{variants[2].sku}}"}
            ]
        });
    });

});
