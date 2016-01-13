To map property-to-property do this:   
<pre>"property1": "{{obj.property1}}"</pre>  

To map array-to-array do this:   
<pre>"images[*]": {"src": "{{pics[*].url}}", "title": "{{pics[*].title}}"}</pre>  

To put property-to-array do this:   
<pre>"images": [{"src": "{{obj.image_url}}"}]</pre>  

You can map to array both some property and another array  
<pre>"images": [{"src": "{{obj.image_url}}"}]
"images[*]": {"src": "{{pics[*].url}}"}</pre>  
