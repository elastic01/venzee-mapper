To map property-to-property do this: 
"property1": "{{obj.property1}}"

To map array-to-array do this: 
"images[*]": {"src": "{{pics[*].url}}", "title": "{{pics[*].title}}"}

To put property-to-array do this: 
"images": [{"src": "{{obj.image_url}}"}]

You can map to array both some property and another array
"images": [{"src": "{{obj.image_url}}"}]
"images[*]": {"src": "{{pics[*].url}}"}
