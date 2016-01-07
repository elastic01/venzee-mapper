'use strict';

describe('mapper functions', function () {

    let mapper = require('../../lib/mapper.js');

    let data = {
        "title": "Puma",
        "description": "Description 1",
        "sizes": ["S", "M", "L"],
        "sku": "SKU1",
        "image_url": "http://test.com/image1.jpg",
        "variant_image_url": "http://test.com/image2.jpg",
        "images": [
            {"url": "http://test.com/image3.jpg"},
            {"url": "http://test.com/image4.jpg"}
        ]
    };

    let mapping = {
        "title": "{{title}}",
        "body_html": "{{description}}",
        "sizes": "{{sizes}}",
        "variants": [{
            "sku": "{{sku}}",
            "option1": "{{option1}}",
            "option2": "{{option2}}",
            "price": "{{price}}"
        }],
        "images": [
            {"src": "{{image_url}}"},
            {"src": "{{variant_image_url}}"}
        ],
        "images[*]": {
            "src": "{{images[*].url}}"
        }

    };

    it('should process all records from msg.body.records', function () {

        let result = mapper.map(data, mapping);
        console.log(JSON.stringify(result));
        expect(result).toEqual({
            "title": "Puma",
            "body_html": "Description 1",
            "sizes": ["S", "M", "L"],
            "variants": [{"sku": "SKU1"}],
            "images": [
                {"src": "http://test.com/image1.jpg"},
                {"src": "http://test.com/image2.jpg"},
                {"src": "http://test.com/image3.jpg"},
                {"src": "http://test.com/image4.jpg"}
            ]
        });
    });

});
