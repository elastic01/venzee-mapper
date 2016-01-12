'use strict';

describe('venzeeToShopify', function () {

    let venzeeToShopify = require('../../actions/venzeeToShopify.js');
    let EventEmitter = require('events').EventEmitter;

    let record = {
        "id": "2",
        "tags": "Sport, Fitness",
        "handle": "product-1",
        "vendor": "Puma",
        "option2_name": "Size",
        "seo_title": "Shoes Seo Title",
        "type": "Shoes",
        "sku": "PROD1-VAR2",
        "option1_name": "Color",
        "option1": "Red",
        "option2": "S",
        "title": "Sport Shoes",
        "seo_description": "Shoes SEO Description",
        "price": "12.55",
        "image_url": "http://pumaecom.scene7.com/image1.jpg",
        "description": "Description 1",
        "vri": "MOE3BXLVUB",
        "images": [
            {"url": "http://pumaecom.scene7.com/image2.jpg"},
            {"url": "http://pumaecom.scene7.com/image3.jpg"}
        ]
    };

    it('should map data to the output', function (done) {

        let mapping = {
            "title": "{{title}}",
            "body_html": "{{description}}",
            "tags": "{{tags}}",
            "handle": "{{handle}}",
            "vendor": "{{vendor}}",
            "product_type": "{{type}}",
            "option_names": {
                "option1": "{{option1_name}}",
                "option2": "{{option2_name}}"
            },
            "metafield_values": {
                "title_tag": "{{seo_title}}",
                "description_tag": "{{seo_description}}"
            },
            "variants[*]": {
                "sku": "{{sku}}",
                "option1": "{{option1}}",
                "option2": "{{option2}}",
                "price": "{{price}}"
            },
            "images[*]": {
                "src": "{{images[*].url}}"
            },
            "images": [{
                "src": "{{image_url}}"
            }]
        };

        let expectedResult = {
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
            "variants": [{
                "sku": "PROD1-VAR2",
                "option1": "Red",
                "option2": "S",
                "price": "12.55"
            }],
            "images": [
                {"src": "http://pumaecom.scene7.com/image1.jpg"},
                {"src": "http://pumaecom.scene7.com/image2.jpg"},
                {"src": "http://pumaecom.scene7.com/image3.jpg"}
            ]
        };

        let emitter = new EventEmitter();
        spyOn(emitter, 'emit').and.callThrough();
        emitter.on('end', onEnd);

        let msg = {body: record};
        let cfg = {mapper: mapping};

        let result = venzeeToShopify.process.call(emitter, msg, cfg);
        expect(result).toEqual([shopifyRecord]);

        function onEnd() {
            let args = emitter.emit.calls.argsFor(0);
            expect(args[0]).toEqual('data');
            expect(args[1].body).toEqual(expectedResult);

            args = emitter.emit.calls.argsFor(1);
            expect(args[0]).toEqual('end');

            done();
        }
    });

    it('should arrays in correct way', function (done) {

        let mapping = {
            "images[*]": {
                "src": "{{images[*].url}}"
            }
        };

        let expectedResult = {
            "images": [
                {"src": "http://pumaecom.scene7.com/image2.jpg"},
                {"src": "http://pumaecom.scene7.com/image3.jpg"}
            ]
        };

        let emitter = new EventEmitter();
        spyOn(emitter, 'emit').and.callThrough();
        emitter.on('end', onEnd);

        let msg = {body: record};
        let cfg = {mapper: mapping};

        let result = venzeeToShopify.process.call(emitter, msg, cfg);
        expect(result).toEqual([shopifyRecord]);

        function onEnd() {
            let args = emitter.emit.calls.argsFor(0);
            expect(args[0]).toEqual('data');
            expect(args[1].body).toEqual(expectedResult);

            args = emitter.emit.calls.argsFor(1);
            expect(args[0]).toEqual('end');

            done();
        }
    });

    it('should arrays both from properties with placeholder and without', function (done) {

        let mapping = {
            "images[*]": {
                "src": "{{images[*].url}}"
            },
            "images": [{
                "src": "{{image_url}}"
            }]
        };

        let expectedResult = {
            "images": [
                {"src": "http://pumaecom.scene7.com/image1.jpg"},
                {"src": "http://pumaecom.scene7.com/image2.jpg"},
                {"src": "http://pumaecom.scene7.com/image3.jpg"}
            ]
        };

        let emitter = new EventEmitter();
        spyOn(emitter, 'emit').and.callThrough();
        emitter.on('end', onEnd);

        let msg = {body: record};
        let cfg = {mapper: mapping};

        let result = venzeeToShopify.process.call(emitter, msg, cfg);
        expect(result).toEqual([shopifyRecord]);

        function onEnd() {
            let args = emitter.emit.calls.argsFor(0);
            expect(args[0]).toEqual('data');
            expect(args[1].body).toEqual(expectedResult);

            args = emitter.emit.calls.argsFor(1);
            expect(args[0]).toEqual('end');

            expect(mapping).toEqual({
                "images[*]": {
                    "src": "{{images[*].url}}"
                },
                "images": [{
                    "src": "{{image_url}}"
                }]
            });

            done();
        }
    });

    it('should arrays both from properties with placeholder and without', function (done) {

        let mapping = {
            "images": [{
                "src": "{{image_url}}"
            }],
            "images[*]": {
                "src": "{{images[*].url}}"
            }
        };

        let expectedResult = {
            "images": [
                {"src": "http://pumaecom.scene7.com/image1.jpg"},
                {"src": "http://pumaecom.scene7.com/image2.jpg"},
                {"src": "http://pumaecom.scene7.com/image3.jpg"}
            ]
        };

        let emitter = new EventEmitter();
        spyOn(emitter, 'emit').and.callThrough();
        emitter.on('end', onEnd);

        let msg = {body: record};
        let cfg = {mapper: mapping};

        let result = venzeeToShopify.process.call(emitter, msg, cfg);
        expect(result).toEqual([shopifyRecord]);

        function onEnd() {
            let args = emitter.emit.calls.argsFor(0);
            expect(args[0]).toEqual('data');
            expect(args[1].body).toEqual(expectedResult);

            args = emitter.emit.calls.argsFor(1);
            expect(args[0]).toEqual('end');

            expect(mapping).toEqual({
                "images": [{
                    "src": "{{image_url}}"
                }],
                "images[*]": {
                    "src": "{{images[*].url}}"
                }
            });

            done();
        }
    });
});
