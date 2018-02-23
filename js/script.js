//var requestURL = "../notes.json";
//var request = new XMLHttpRequest();
//request.open('GET', requestURL);
//request.responseType = 'json';
//request.send();
//request.onload = function() {
//    var notes = request.response;
//    console.table(notes);
//}
/* ========================================================================= */
/* BE SURE TO COMMENT CODE/IDENTIFY PER PLUGIN CALL */
/* ========================================================================= */
jQuery(function($){
    void function () {
        var addBtn = $("#note-add-btn");
        var manageBtn = $("#note-manage-btn");
        var doneBtn = $("#note-done-btn");
        var noteForm = $("#note-form");
        $(addBtn).on("click", function() {
            $(noteForm).fadeToggle(300);
        });
        $(manageBtn).on("click", function() {
            var itemBtn = $(".item-btns");
            $(itemBtn).toggleClass("active");
            $(noteForm).fadeOut(300);
            $(this).hide();
            $(doneBtn).show();
        });
        $(doneBtn).on("click", function() {
            var itemBtn = $(".item-btns");
            $(itemBtn).removeClass("active");
            $(this).hide();
            $(manageBtn).show();
        });
    } ();
    
    noteManagement();

    function noteManagement() {
        // Declare CKEditor WYSIWYG Fields
        var syntaxEditor, descriptionEditor
    //    syntaxEditor = CKEDITOR.replace('.add-syntax');
    //    descriptionEditor = CKEDITOR.replace('add-description');

        // Declare Local Note Vars
        var noteEditBtn = $("#note-edit-btn");
        var noteDoneBtn = $("#note-done-btn");
        var itemBtns;
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
                syntax = $("#add-syntax").val();
                description = $("#add-description").val();

    //            syntax = syntaxEditor.activeFilter.editor.getData();
    //            description = descriptionEditor.activeFilter.editor.getData();

                // Create A New Note
                addNote(id, title, category, introduction, syntax, description);
                // Increase Note ID
                noteID ++;

            });
        }
        function deleting() {
            $(noteList).on("click", function(e) {
                deleteNote(e.target);
            });
        }
        function editing() {
            $(noteEditBtn).on("click", function(e) {
                var target = e.target;
                var targetID = target.dataset.targetField;
                if(!$("#"+targetID).is(":empty")) {
                    $(target).hide();
                    $(noteDoneBtn).show();
                    $(itemBtns).show();

                    editFieldTrigger(target);
                }
            });
        }
        function done() {
            
        }
        /* ============================================================== */
        /*    ADD A NEW NOTE ELEMENT WITH PARAMETERS */
        /* ============================================================== */
        function addNote(id, title, category, introduction, syntax, description) {
            var newNote = new note(id, title, category, introduction, syntax, description);
            notes[noteID] = newNote;

            displayNote(newNote);
        }

        /* ============================================================== */
        /* DELETE A NEW NOTE BASED ON THE ID */ 
        /* ============================================================== */
        function deleteNote(e) {
            if($(e).hasClass("delete-btn")) {
                var targetID = $(e).attr("id").slice(10);
                var r = confirm("Are You Sure You Want to Delete This Item?");
                if( r === true ) {
                    $("#note"+targetID).remove();
                    notes[targetID] = '';
                } else {
                    return false;
                }
            }
            console.table(notes);
        }

        /* ============================================================== */
        /* DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE */   
        /* ============================================================== */
        function displayNote(note) {
            var list, listItem, itemTop, itemBottom, itemHeader, itemTitle, itemCategory, itemIntroduction, itemSyntax, itemDescription, itembtns, itemDelete, itemDeleteBtn;
            list = $("#noteList");
            // Create New Element
            listItem = document.createElement("li");

            // Define ID
            var itemId = "note"+noteID;
            var editId = "noteEdit"+noteID;
            var deleteId = "noteDelete"+noteID;

            // Define Classes
            var itemClass = "list-item list-group-item list-group-item-action";
            var headerClass = "item-header";
            var topClass = "item-top";
            var bottomClass = "item-bottom";
            var TitleClass = "item-title note-field-text";
            var categoryClass = "item-category note-field-select";
            var introductionClass = "item-introduction note-field-area";
            var syntaxClass = "item-syntax note-field-area";
            var descriptionClass = "item-description note-field-area";
            var btnsClass = "item-btns";
            var deleteClass = "item-btn delete-btn";
            var deleteBtnClass = "fas fa-trash-alt";
            var editClass = "item-btn edit-btn";
            var editBtnClass = "far fa-edit";

            /* =========== Item Top ============ */
            // Item Header
            itemTitle = "<p class=\""+TitleClass+"\">"+note.title+"</p>";
            itemCategory = "<h5 class=\""+categoryClass+"\">"+note.category+"</h5>";
            itemHeader = "<div class=\""+headerClass+"\">"+itemTitle+itemCategory+"</div>";
            // Item Introduction
            itemIntroduction = "<p class=\""+introductionClass+"\">"+note.introduction+"</p>";

            itemTop = "<div class=\""+topClass+"\">"+itemHeader+itemIntroduction+"</div>";

            /* =========== Item Bottom ============ */
            itemSyntax = "<div class=\""+syntaxClass+"\">"+note.syntax+"</div>";
            itemDescription = "<div class=\""+descriptionClass+"\">"+note.description+"</div>";

            itemBottom = "<div class=\""+bottomClass+"\">"+itemSyntax+itemDescription+"</div>";

            /* =========== Item Buttons ============ */
            itemEditBtn = "<i class=\""+editBtnClass+"\"></i>";
            itemEdit = "<button id=\""+editId+"\" class=\""+editClass+"\">"+itemEditBtn+"</button>";
            itemDeleteBtn = "<i class=\""+deleteBtnClass+"\"></i>";
            itemDelete = "<button id=\""+deleteId+"\" class=\""+deleteClass+"\">"+itemDeleteBtn+"</button>";

            itembtns = "<div class=\""+btnsClass+"\">"+itemDelete+itemEdit+"</div>";

            /* =========== List Item ============ */
            listItem = "<li id=\""+itemId+"\" class=\""+itemClass+"\">"+itemTop+itemBottom+itembtns+"</li>";

            $(list).append(listItem);
            itemBtns = $(".item-btns");
        }

        /* ============================================================== */
        /* EDITE NOTES FUNCTION */
        /* ============================================================== */
        function editFieldTrigger(e) {
            var targetID = e.dataset.targetField;
            var textField, selectField;
            textField = $(".note-field-text");
            areaField = $(".note-field-area");
            selectField =$(".note-field-select");

            //textField.attr("contenteditable", true);
            $(textField).each(function() {
                var filedVal = $(this).text();
                var content;
                content = "<input type=\"text\" class=\"form-control\" value=\""+filedVal+"\">";
                $(this).html(content);
            });

            $(areaField).each(function() {
                var filedVal = $(this).text();
                var content;
                content = "<textarea class=\"form-control\">"+filedVal+"</textarea>";
                $(this).html(content);
            });

            $(selectField).each(function() {
                var fieldVal = $(this).text();
                var content;
                content = "<select class=\"form-control\">";
                content += "<option value=\"Category\""+(fieldVal==="Category"?" selected=\"selected\"":"")+">Category</option>";
                content += "<option value=\"JavaScript\""+(fieldVal==="JavaScript"?" selected=\"selected\"":"")+">JavaScript</option>";
                content += "<option value=\"jQuery\""+(fieldVal==="jQuery"?" selected=\"selected\"":"")+">jQuery</option>";
                content += "</select>";
                $(this).html(content);
            });
        }

        function doneEditTrigger(e) {
            var textField = $(".note-field-text");
            var areaField = $(".note-field-area");
            var selectField =$(".note-field-select");
            var item = noteList.childNodes;

            $(textField).each(function() {
                var fieldVal = $(this).find("input").val();
                $(this).text(fieldVal);
            });

            $(areaField).each(function() {
                var fieldVal = $(this).find("textarea").val();
                $(this).text(fieldVal);
            });

            $(selectField).each(function() {
                var fieldVal = $(this).find("select").val();
                $(this).text(fieldVal);
            });
        }
    }
});