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
        "option1_name": "Size",
        "option2_name": "Color",
        "lorem ipsum dolor sit amet": "lorem ipsum",
        "images": [
            {"url": "http://test.com/image3.jpg"},
            {"url": "http://test.com/image4.jpg"}
        ]
    };

    it('map function should map everything - strings, arrays, etc', function () {

        let mapping = {
            "title": "{{title}}",
            "subtitle": "Some static value",
            "subtitle1": "Some static value with {{title}} and {{description}} and {{sizes}}",
            "some_property": "{{lorem ipsum dolor sit amet}}",
            "body_html": "{{description}}",
            "sizes": "{{sizes}}",
            "option_names": {
                "option1": "{{option1_name}}",
                "option2": "{{option2_name}}"
            },
            "variants": [{
                "sku": "{{sku}}",
                "option1": "{{option1}}",
                "option2": "{{option2}}",
                "price": "{{price}}",
                "images[*]": {
                    "src": "{{images[*].url}}"
                }
            }],
            "images": [
                {"src": "{{image_url}}"},
                {"src": "{{variant_image_url}}"}
            ],
            "images[*]": {
                "src": "{{images[*].url}}"
            },
            "urls": ["some-static_value"],
            "urls[*]": "{{images[*].url}}"
        };

        let result = mapper.map(data, mapping);
        expect(result).toEqual({
            "title": "Puma",
            "subtitle": "Some static value",
            subtitle1: 'Some static value with Puma and Description 1 and S,M,L',
            some_property: 'lorem ipsum',
            "body_html": "Description 1",
            "sizes": ["S", "M", "L"],
            option_names: {
                option1: 'Size',
                option2: 'Color'
            },
            "variants": [{
                "sku": "SKU1",
                "images": [
                    {"src": "http://test.com/image3.jpg"},
                    {"src": "http://test.com/image4.jpg"}
                ]
            }],
            "images": [
                {"src": "http://test.com/image1.jpg"},
                {"src": "http://test.com/image2.jpg"},
                {"src": "http://test.com/image3.jpg"},
                {"src": "http://test.com/image4.jpg"}
            ],
            urls: ["some-static_value", 'http://test.com/image3.jpg', 'http://test.com/image4.jpg']
        });
    });
});
