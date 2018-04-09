Vue.component('main-menu', {
    data: function() {
        return {
            menus: [
                { text: "Home", link: "index.html" },
                { text: "Admin", link: "admin.html" }
            ]
        };
    },
    template: '<ul id="main-menu"><li v-for="menu in menus"><a href="{{ menu.link }}">{{ menu.text }}</a></li></ul>'
});

var app = new Vue({
    el: '#app',
    data: {
        showMainMenu: false,
        hideNoteList: false,
        showNoteDetail: false,
        categories: ["array", "booleans", "date", "error", "global"],
        notes: [
            { "id": 1, "title": "length", "category": "array", "introduction": "Sets or returns the number of elements in an array", "syntax": "<p>var&nbsp;fruits = [&quot;Banana&quot;,&nbsp;&quot;Orange&quot;,&nbsp;&quot;Apple&quot;,&nbsp;&quot;Mango&quot;];<br />fruits.length;</p>", "description": "<p>The length property sets or returns the number of elements in an array.</p>" },
            { "id": 2, "title": "prototype", "category": "array", "introduction": "Allows you to add properties and methods to an Array object", "syntax": "<p>Make a new array method that transforms array values into upper case:</p><p>Array.prototype.myUcase&nbsp;=&nbsp;function() {<br />&nbsp;&nbsp;&nbsp;&nbsp;for&nbsp;(i =&nbsp;0; i &lt;&nbsp;this.length; i++) {<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this[i] =&nbsp;this[i].toUpperCase();<br />&nbsp;&nbsp;&nbsp; }<br />};</p><p>Make an array, then call the myUcase method:</p><p>var&nbsp;fruits = [&quot;Banana&quot;,&nbsp;&quot;Orange&quot;,&nbsp;&quot;Apple&quot;,&nbsp;&quot;Mango&quot;];<br />fruits.myUcase();</p>", "description": "<p>The prototype constructor allows you to add new properties and methods to the Array() object.</p><p>When constructing a property, ALL arrays will be given the property, and its value, as default.</p><p>When constructing a method, ALL arrays will have this method available.</p><p><strong>Note:</strong>&nbsp;Array.prototype does not refer to a single array, but to the Array() object itself.</p><p><strong>Note:</strong>&nbsp;Prototype is a global object constructor which is available for all JavaScript objects.</p>" },
            { "id": 3, "title": "constructor", "category": "booleans", "introduction": "Returns the function that created JavaScript's Boolean prototype", "syntax": "<p>var&nbsp;bool =&nbsp;false;</p>", "description": "<p>In JavaScript, the constructor property returns the constructor function for an object.</p><p>The return value is a reference to the function, not the name of the function:</p><p>For JavaScript&nbsp;<strong>numbers</strong>&nbsp;the constructor property returns&nbsp;<strong>function Number() { [native code] }</strong></p><p>For JavaScript&nbsp;<strong>strings</strong>&nbsp;the constructor property returns&nbsp;<strong>function String() { [native code] }</strong></p><p>For JavaScript&nbsp;<strong>booleans</strong>&nbsp;the constructor property returns&nbsp;<strong>function Boolean() { [native code] }</strong></p>" },
            { "id": 4, "title": "prototype", "category": "booleans", "introduction": "Allows you to add properties and methods to the Boolean prototype", "syntax": "<p>Make a new method for JavaScript booleans:</p><p>Boolean.prototype.myColor&nbsp;=&nbsp;function() {<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.valueOf() ==&nbsp;true) {<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;&quot;green&quot;;<br />&nbsp;&nbsp;&nbsp; }&nbsp;else&nbsp;{<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;=&nbsp;&quot;red&quot;;<br />&nbsp;&nbsp;&nbsp; }<br />};</p><p><br />Create a boolean, then call myColor():</p><p>var&nbsp;a =&nbsp;true;<br />var&nbsp;b = a.myColor();</p>", "description": "<p>The prototype constructor allows you to add new properties and methods to JavaScript booleans.</p><p>When constructing a property, ALL booleans will be given the property, and its value, as default.</p><p>When constructing a method, ALL booleans will have this method available.</p><p><strong>Note:</strong>&nbsp;Boolean.prototype does not refer to a single boolean, but to the Boolean() object itself.</p><p><strong>Note:</strong>&nbsp;Prototype is a global object constructor which is available for all JavaScript objects.</p>" },
            { "id": 5, "title": "constructor", "category": "date", "introduction": "Returns the function that created the Date object's prototype", "syntax": "<p>The constructor property returns a date&#39;s constructor function:</p><p>var&nbsp;d =&nbsp;new&nbsp;Date();</p>", "description": "<p>In JavaScript, the constructor property returns the constructor function for an object.</p><p>The return value is a reference to the function, not the name of the function:</p><p>For JavaScript&nbsp;<strong>dates</strong>&nbsp;the constructor property returns&nbsp;<strong>function Date() { [native code] }</strong></p><p>For JavaScript&nbsp;<strong>numbers</strong>&nbsp;the constructor property returns&nbsp;<strong>function Number() { [native code] }</strong></p><p>For JavaScript&nbsp;<strong>strings</strong>&nbsp;the constructor property returns&nbsp;<strong>function String() { [native code] }</strong></p>" },
            { "id": 6, "title": "prototype", "category": "date", "introduction": "Allows you to add properties and methods to an object", "syntax": "<p>Make a new date method that gives the date object a month-name property called myProp:</p><p>Date.prototype.myMet&nbsp;=&nbsp;function() {<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.getMonth() ==&nbsp;0){this.myProp&nbsp;=&nbsp;&quot;January&quot;};<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.getMonth() ==&nbsp;1){this.myProp&nbsp;=&nbsp;&quot;February&quot;};<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.getMonth() ==&nbsp;2){this.myProp&nbsp;=&nbsp;&quot;March&quot;};<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.getMonth() ==&nbsp;3){this.myProp&nbsp;=&nbsp;&quot;April&quot;};<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.getMonth() ==&nbsp;4){this.myProp&nbsp;=&nbsp;&quot;May&quot;};<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.getMonth() ==&nbsp;5){this.myProp&nbsp;=&nbsp;&quot;June&quot;};<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.getMonth() ==&nbsp;6){this.myProp&nbsp;=&nbsp;&quot;July&quot;};<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.getMonth() ==&nbsp;7){this.myProp&nbsp;=&nbsp;&quot;August&quot;};<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.getMonth() ==&nbsp;8){this.myProp&nbsp;=&nbsp;&quot;September&quot;};<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.getMonth() ==&nbsp;9){this.myProp&nbsp;=&nbsp;&quot;October&quot;};<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.getMonth() ==&nbsp;10){this.myProp&nbsp;=&nbsp;&quot;November&quot;};<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(this.getMonth() ==&nbsp;11){this.myProp&nbsp;=&nbsp;&quot;December&quot;};<br />};</p><p>Make a Date object, then call the myMet method:</p><p>var&nbsp;d =&nbsp;new&nbsp;Date();<br />d.myMet();<br />var&nbsp;monthname = d.myProp;</p>", "description": "<p>The prototype constructor allows you to add new properties and methods to the Date() object.</p><p>When constructing a property, ALL date objects will be given the property, and its value, as default.</p><p>When constructing a method, ALL date objects will have this method available.</p><p><strong>Note:</strong>&nbsp;Date.prototype does not refer to a single date object, but to the Date() object itself.</p><p><strong>Note:</strong>&nbsp;Prototype is a global object constructor which is available for all JavaScript objects.</p>" },
            { "id": 7, "title": "name", "category": "error", "introduction": "Sets or returns an error name", "syntax": "<p>Return the error name (we have written &quot;alert&quot; as &quot;adddlert&quot; to deliberately produce an error):</p><p>try&nbsp;{<br />&nbsp;&nbsp;&nbsp; adddlert(&quot;Welcome guest!&quot;);<br />}<br />catch(err) {<br />&nbsp;&nbsp;&nbsp; document.getElementById(&quot;demo&quot;).innerHTML&nbsp;= err.name;<br />}</p>", "description": "<p>The name property sets or returns the name of an error.</p><p>Six different values can be returned by the error name property:</p><ul><li>EvalError: An error has occurred in the eval() function.&nbsp;<strong>Note:</strong>&nbsp;Newer versions of JavaScript does not throw any EvalError. Use&nbsp;<strong>SyntaxError</strong>&nbsp;instead.</li><li><p>RangeErrorA number &quot;out of range&quot; has occurred</p></li><li><p>ReferenceErrorAn illegal reference has occurred</p></li><li><p>SyntaxErrorA syntax error has occurred</p></li><li><p>TypeErrorA type error has occurred</p></li><li><p>URIErrorAn error in encodeURI() has occurred</p></li></ul>" },
            { "id": 0, "title": "constructor", "category": "array", "introduction": "Returns the function that created the Array object's prototype", "syntax": "<p>var&nbsp;fruits = [&quot;Banana&quot;,&nbsp;&quot;Orange&quot;,&nbsp;&quot;Apple&quot;,&nbsp;&quot;Mango&quot;];<br />fruits.constructor;</p>", "description": "<p>In JavaScript, the constructor property returns the constructor function for an object.</p><p>The return value is a reference to the function, not the name of the function:</p><p>For JavaScript&nbsp;<strong>arrays</strong>&nbsp;the constructor property returns&nbsp;<strong>function Array() { [native code] }</strong></p><p>For JavaScript&nbsp;<strong>numbers</strong>&nbsp;the constructor property returns&nbsp;<strong>function Number() { [native code] }</strong></p><p>For JavaScript&nbsp;<strong>strings</strong>&nbsp;the constructor property returns&nbsp;<strong>function String() { [native code] }</strong></p>" }, { "id": 8, "title": "message", "category": "error", "introduction": "Sets or returns an error message (a string)", "syntax": "<p>Return an error message (we have written &quot;alert&quot; as &quot;adddlert&quot; to deliberately produce an error):</p><p>try&nbsp;{<br />&nbsp;&nbsp;&nbsp; adddlert(&quot;Welcome guest!&quot;);<br />}<br />catch(err) {<br />&nbsp;&nbsp;&nbsp; document.getElementById(&quot;demo&quot;).innerHTML&nbsp;= err.message;<br />}</p>", "description": "<p>The message property sets or returns an error message.</p><p><strong>Tip:</strong>&nbsp;Also see the&nbsp;<a href=\"https://www.w3schools.com/jsref/prop_error_name.asp\">name</a>&nbsp;property of the Error object.</p>" }
        ],
        detailTitle: null,
        detailCategory: null,
        detailIntroduction: null,
        detailSyntax: null,
        detailDescription: null
    },
    methods: {
        displayNoteDetail: function(note, event) {
            if (event) event.preventDefault();
            this.detailTitle = note.title;
            this.detailCategory = note.category;
            this.detailIntroduction = note.introduction;
            this.detailSyntax = note.syntax;
            this.detailDescription = note.description;
            this.hideNoteList = true;
            this.showNoteDetail = true;

            hljs.initHighlightingOnLoad();
            hljs.configure({ useBR: true });
            $('.code').each(function (i, block) {
                hljs.highlightBlock(block);
            });
        },
        hideNoteDetail: function(event) {
            if (event) event.preventDefault();
            this.showNoteDetail = false;
            this.hideNoteList = false;
        }
    }
    // created: function () {
    //     var _this = this;
    //     $.getJSON('notes.json', function (json) {
    //         _this.notes = json;
    //     });
    // }
});