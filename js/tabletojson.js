(function ($) {
    $.fn.extend({

        //pass the options variable to the function
        tabletojson: function (options) {



            //Set the default values, use comma to separate the settings, example:
            var defaults = {
                headers: null,  //supply headers you want to include plus column position 0 based.

                attributes: null, //supply attributes you want to include, attribute name and then how you want it to appear in JSON string.
                onComplete: null,  //supply callback function, called when json build is complete

                dumpElement: null
            };

            options = $.extend(defaults, options);

            return this.each(function () {


                var o = options;
                var $tbl = $(this);
                var headerList = [];
                var attribList = [];

                var headerArray = eval("(" + o.headers + ")");
                var attribArray = eval("(" + o.attributes + ")");

                //in this case, if custom headers, build them, else just use table headers.
                if (o.headers !== null) {

                    for (h in headerArray) {
                        nvp = {};
                        nvp.Name = h;
                        nvp.Value = headerArray[h];
                        headerList[headerList.length] = nvp;

                    }
                } else {
                    headerList = getHeaders($tbl);
                }
                //and here, if attributes are indicated, collect them.
                if (o.attributes !== null) {

                    for (h in attribArray) {
                        nvp = {};
                        nvp.Name = h;
                        nvp.Value = attribArray[h];
                        attribList[attribList.length] = nvp;

                    }
                }
                //now build the json and dump.
                var json = buildJSON($tbl, attribList, headerList);
                $(o.dumpElement).val(json);

                if (o.onComplete !== null) {
                    o.onComplete(json);
                }
                return this;

            });
        }
    });
    function buildJSON($table, a, h) {

        var sb = new StringBuilder();  //using stringbuilder for concat efficiency.

        var sbv = new StringBuilder();
        var values = [];
        var rows = [];
        sb.append("[");

        //get header/values
        $table.find("tbody tr:not(:has('th'))").each(function () {
            sbv.clear();

            sbv.append("{");
            values.length = 0;
            // first iterate headers and build json string
            for (x = 0; x < h.length; x++) {

                values[values.length] = "\"" + h[x].Value + "\":\"" + $(this).find("td").eq(h[x].Name).text() + "\"";
				//values[values.length] = "\"" + h[x].Value + "\":" + $(this).find("td").eq(h[x].Name).text() + "";


            }
            //now iterate attributes and build json strin
            for (x = 0; x < a.length; x++) {
                var name = $(this).attr(a[x].Name);

                var val = a[x].Value;
                name = typeof (name) == 'undefined' ? "" : name;

                val = typeof (val) == 'undefined' ? "" : val;
                values[values.length] = "\"" + val + "\":\"" + name + "\"";
				//values[values.length] = "\"" + val + "\":" + name + "";

            }
            //at each data item, use join to create a comma delimited list or data items.
            sbv.append(values.join(","));
            sbv.append("}");

            rows[rows.length] = sbv.toString();
        });
        //at each row, use join to create a comma delimited list of rows
        sb.append(rows.join(","));


        sb.append("]");

        return sb.toString();
    }

    function getHeaders($table) {
        var h = [];

        var cnt = 0;
        //just iterate th's and dump data to headerlist
        $table.find("tr th").each(function () {

            var nvp = {};
            nvp.Name = String(cnt);
            nvp.Value = $(this).text();
            h[h.length] = nvp;
        });
        return h;

    }

})(jQuery);

// Initializes a new instance of the StringBuilder class
// and appends the given value if supplied
function StringBuilder(value) {

    this.strings = [""];
    this.append(value);
}

// Appends the given value to the end of this instance.

StringBuilder.prototype.append = function (value) {
    if (value) {
        this.strings.push(value);
    }
};


// Clears the string buffer
StringBuilder.prototype.clear = function () {
    this.strings.length = 1;
};


// Converts this instance to a String.
StringBuilder.prototype.toString = function () {
    return this.strings.join("");

};



 