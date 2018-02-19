//var requestURL = "../notes.json";
//var request = new XMLHttpRequest();
//request.open('GET', requestURL);
//request.responseType = 'json';
//request.send();
//request.onload = function() {
//    var notes = request.response;
//    console.table(notes);
//}
noteManagement();

function noteManagement() {
    // Declare CKEditor WYSIWYG Fields
    var syntaxEditor, descriptionEditor
    syntaxEditor = CKEDITOR.replace('add-syntax');
    descriptionEditor = CKEDITOR.replace('add-description');
    
    // Declare Local Note Vars
    var noteEditBtn = $("#note-edit-btn");
    var noteDoneBtn = $("#note-done-btn");
    var itemBtns = $(".item-btns");
    var formEl = $("#new-form");
    var noteList = $("#noteList");
    var notes = [];
    var noteID = 0;
    
    // Calling Local Note Functions
    adding();
    deleting();
    editing();
    done();
    /* ============================================================== */
    /*    DECLARE A NEW NOTE OBJECT */
    /* ============================================================== */
    function note(id, title, category, introduction, syntax, description) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.introduction = introduction;
        this.syntax = syntax;
        this.description = description;
    }
    /* ============================================================== */
    /* ALL EVENTS TO MANAGE NOTES CONTENT */
    /* ============================================================== */
    function adding() {
        $(formEl).on("submit", function(e) {
            e.preventDefault();
            var id, title, category, introduction, syntax, description;
            
            id = noteID;
            title = $("#add-title").val();
            category = $("#add-category").val();
            introduction = $("#add-introduction").val();
            syntax = syntaxEditor.activeFilter.editor.getData();
            description = descriptionEditor.activeFilter.editor.getData();
            
            // Create A New Note
            addNote(id, title, category, introduction, syntax, description);
            // Increase Note ID
            noteID ++;
            
        });
    }
    function deleting() {
        $(noteList).on("click", function(e) {
            deleteNote(e.target);
        }, false);
    }
    function editing() {
        $(noteEditBtn).on("click", function(e) {
            var target = e.target;
            target.hide();
            noteDoneBtn.show();
            itemBtns.show();
            
            editFieldTrigger(target);
        }, false);
    }
    function done() {
        $(noteDoneBtn).on("click", function(e) {
            var target = e.target;
            target.hide();
            noteEditBtn.show();
            itemBtns.hide();
            
            doneEditTrigger(e);
        }, false);
    }
    /* ============================================================== */
    /*    ADD A NEW NOTE ELEMENT WITH PARAMETERS */
    /* ============================================================== */
    function addNote(id, title, category, introduction, syntax, description) {
        var newNote = new note(id, title, category, introduction, syntax, description);
        notes[noteID] = newNote;
        
        console.table(notes);
        
        displayNote(newNote);
    }

    /* ============================================================== */
    /* DELETE A NEW NOTE BASED ON THE ID */ 
    /* ============================================================== */
    function deleteNote(e) {
        if(e.hasClass("delete-btn")) {
            var targetID = e.attr("id").slice(10);
            var targetItem = $(targetID);
            var r = confirm("Are You Sure You Want to Delete This Item?");
            if( r === true ) {
                $("note"+targetItem).remove();
                notes[targetID] = '';
            } else {
                return false;
            }
        }
    }

    /* ============================================================== */
    /* DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE */   
    /* ============================================================== */
    function displayNote(note) {
        var list, listItem, listItem, itemTop, itemBottom, itemHeader, itemTitle, itemCategory, itemIntroduction, itemSyntax, itemDescription, itemHeader, itembtns, itemDelete, itemDeleteBtn;
        list = $("#noteList");
        listItem = document.createElement("li");
        itemTop = document.createElement("div");
        itemBottom = document.createElement("div");
        itemHeader = document.createElement("div");
        itemTitle = document.createElement("p");
        itemCategory = document.createElement("h5");
        itemIntroduction = document.createElement("p");
        itemSyntax = document.createElement("div");
        itemDescription = document.createElement("div");
        itemHeader = document.createElement("div");
        itembtns = document.createElement("div");
        itemDelete = document.createElement("button");
        itemDeleteBtn = document.createElement("i");
        
        $(listItem).attr("id", "note"+noteID);
        $(itemDelete).attr("id", "noteDelete"+noteID);

        $(listItem).addClass("list-item list-group-item list-group-item-action");
        $(itemHeader).addClass("item-header");
        $(itemTop).addClass("item-top");
        $(itemBottom).addClass("item-bottom");
        $(itemHeader).addClass("item-header");
        $(itemTitle).addClass("item-title note-field-text");
        $(itemCategory).addClass("item-category note-field-select");
        $(itemIntroduction).addClass("item-introduction note-field-text");
        $(itemSyntax).addClass("item-syntax note-field-text");
        $(itemDescription).addClass("item-description note-field-text");
        $(itembtns).addClass("item-btns");
        $(itemDelete).addClass("item-btn delete-btn");
        $(itemDeleteBtn).addClass("fas fa-trash-alt");

        $(itemTitle).text(note.title);
        $(itemCategory).text(note.category);
        $(itemIntroduction).text(note.introduction);
        $(itemSyntax).text(note.syntax);
        $(itemDescription).text(note.description);

        /* =========== Item Top ============ */
        // Item Header
            $(itemHeader).append(itemTitle); // Item Title
            $(itemHeader).append(itemCategory); // Item Category
            $(itemTop).append(itemHeader);
            $(itemTop).append(itemIntroduction); // Item Introductio
        /* =========== Item Bottom ============ */
            $(itemBottom).append(itemSyntax); // Item Syntax
            $(itemBottom).append(itemDescription); // Item Description
        /* =========== Item Buttons ============ */
            $(itemDelete).append(itemDeleteBtn);
            $(itembtns).append(itemDelete);
        /* =========== List Item ============ */
        $(listItem).append(itemTop);
        $(listItem).append(itemBottom);
        $(listItem).append(itembtns);

        $(list).append(listItem);
    }

    /* ============================================================== */
    /* EDITE NOTES FUNCTION */
    /* ============================================================== */
    function editFieldTrigger(e) {
        var targetID = e.dataset.targetField;
        var targetEl = $(targetID);
        var textField, selectField;
        textField = $(".note-field-text");
        selectField =$(".note-field-select");
        
        textField.attr("contenteditable", true);
        
        $(selectField).each(function() {
            var fieldVal = this.text();
            selectContent = "<select class=\"form-control\">";
            selectContent += "<option value=\"Category\""+(fieldVal==="Category"?" selected=\"selected\"":"")+">Category</option>";
            selectContent += "<option value=\"JavaScript\""+(fieldVal==="JavaScript"?" selected=\"selected\"":"")+">JavaScript</option>";
            selectContent += "<option value=\"jQuery\""+(fieldVal==="jQuery"?" selected=\"selected\"":"")+">jQuery</option>";
            selectContent += "</select>";
            $(this).innerHTML = selectContent;
        });
    }
    
    function doneEditTrigger(e) {
        var textField = $(".note-field-text");
        var selectField =$(".note-field-select");
        var item = noteList.childNodes;
        
        textField.attr("contenteditable", false);
        
        selectField.each(function() {
            this.text() = $(this).childNodes[0].value;
        });
        
        for(var i=0; i<item.length; i++) {
            var itemID = item[i].getAttribute("id").slice(4);
            var itemChildren = item[i].childNodes;
            
            for(var j=0; j<itemChildren.length; j++) {
                if(itemChildren[j].className == "item-title note-field-text") {
                    notes[itemID].title = itemChildren[j].textContent;
                } else if(itemChildren[j].className == "item-category note-field-select") {
                    notes[itemID].category = itemChildren[j].textContent;
                } else if(itemChildren[j].className == "item-introduction note-field-text") {
                    notes[itemID].introduction = itemChildren[j].textContent;
                } else if(itemChildren[j].className == "item-syntax note-field-text") {
                    notes[itemID].syntax = itemChildren[j].textContent;
                } else if(itemChildren[j].className == "item-description note-field-text") {
                    notes[itemID].description = itemChildren[j].textContent;
                }
            }
        }
        return;
    }
}
