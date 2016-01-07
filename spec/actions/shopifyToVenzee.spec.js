'use strict';

describe('shopifyToVenzee', function () {

    let shopifyToVenzee = require('../../actions/shopifyToVenzee.js');
    let EventEmitter = require('events').EventEmitter;

    let shopifyRecord = {
        "title": "Sport Shoes",
        "body_html": "Description 1",
        "tags": "Sport, Fitness",
        "handle": "product-1",
        "vendor": "Puma",
        "product_type": "Shoes",
        "option_names": {
            "option1": "Color",
            "option2": "Size"
        },
        "metafield_values": {
            "title_tag": "Shoes Seo Title",
            "description_tag": "Shoes SEO Description"
        },
        "variants": [
            {
                "sku": "PROD1-VAR1",
                "option1": "Red",
                "option2": "S",
                "price": "12.55",
                "image_src": "http://pumaecom.scene7.com/image2.jpg"
            },
            {
                "sku": "PROD1-VAR2",
                "option1": "Red",
                "option2": "M",
                "price": "13.55",
                "image_src": "http://pumaecom.scene7.com/image3.jpg"
            }
        ],
        "images": [
            {"src": "http://pumaecom.scene7.com/image4.jpg"},
            {"src": "http://pumaecom.scene7.com/image5.jpg"}
        ],
        "image_src": "http://pumaecom.scene7.com/image1.jpg"
    };

    let mapping = {
        "id": "{{id}}",
        "handle": "{{handle}}",
        "description": "{{body_html}}",
        "option1_name": "{{option_names.option1}}",
        "option2_name": "{{option_names.option2}}",
        "seo_description": "{{metafield_values.description_tag}}",
        "seo_title": "{{metafield_values.title_tag}}",
        "tags": "{{tags}}",
        "title": "{{title}}",
        "type": "{{product_type}}",
        "vendor": "{{vendor}}",
        "image_url": "{{image_src}}",
        "option1": "{{variant.option1}}",
        "option2": "{{variant.option2}}",
        "variant_image_url": "{{variant.image_src}}",
        "sku": "{{variant.sku}}",
        "price": "{{variant.price}}",
        "images": [{
            "url": "{{variant.image_src}}"
        }]
    };

    it('should emit two records', function (done) {

        let emitter = new EventEmitter();
        spyOn(emitter, 'emit').and.callThrough();
        emitter.on('end', checkResults);

        let msg = {body: shopifyRecord};
        let cfg = {mapper: mapping};

        shopifyToVenzee.process.call(emitter, msg, cfg);

        function checkResults() {

            let args = emitter.emit.calls.argsFor(0);
            expect(args[0]).toEqual('data');
            expect(args[1].body).toEqual({
                "handle": "product-1",
                "description": "Description 1",
                "option1_name": "Color",
                "option2_name": "Size",
                "seo_description": "Shoes SEO Description",
                "seo_title": "Shoes Seo Title",
                "tags": "Sport, Fitness",
                "title": "Sport Shoes",
                "type": "Shoes",
                "vendor": "Puma",
                "image_url": "http://pumaecom.scene7.com/image1.jpg",
                "option1": "Red",
                "option2": "S",
                "variant_image_url": "http://pumaecom.scene7.com/image2.jpg",
                "sku": "PROD1-VAR1",
                "price": "12.55",
                "images": [
                    {"url": "http://pumaecom.scene7.com/image2.jpg"}
                ]
            });

            args = emitter.emit.calls.argsFor(1);
            expect(args[0]).toEqual('data');
            expect(args[1].body).toEqual({
                "handle": "product-1",
                "description": "Description 1",
                "option1_name": "Color",
                "option2_name": "Size",
                "seo_description": "Shoes SEO Description",
                "seo_title": "Shoes Seo Title",
                "tags": "Sport, Fitness",
                "title": "Sport Shoes",
                "type": "Shoes",
                "vendor": "Puma",
                "image_url": "http://pumaecom.scene7.com/image1.jpg",
                "option1": "Red",
                "option2": "M",
                "variant_image_url": "http://pumaecom.scene7.com/image3.jpg",
                "sku": "PROD1-VAR2",
                "price": "13.55",
                "images": [
                    {"url": "http://pumaecom.scene7.com/image3.jpg"}
                ]
            });

            args = emitter.emit.calls.argsFor(2);
            expect(args[0]).toEqual('end');

            done();
        }
    });


});
