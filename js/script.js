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
// Declare Global CKEditor WYSIWYG Fields
var syntaxEditor = CKEDITOR.replace('add-syntax');
var descriptionEditor = CKEDITOR.replace('add-description');

// Declare Global Note Vars
var noteEditBtn, noteDoneBtn, formEl, noteList, notes, noteID, addBtn, manageBtn, doneBtn, noteForm, notes, noteID;
noteForm = $("#note-form-container");
editBtn = $("#note-edit-btn");
doneBtn = $("#note-done-btn");
addBtn = $("#note-add-btn");
manageBtn = $("#note-manage-btn");
formEl = $("#note-form");
noteList = $("#noteList");
doneBtn = $("#note-done-btn");
notes = [];
noteID = 0;

jQuery(function($){
    noteHeader();
    noteBody();
});

/* ============================================================== */
/*    EVENT FOR ALL NOTE HEADING BUTTONS */
/* ============================================================== */
function noteHeader() {
    $(addBtn).on("click", function(e) {
        var target = e.target;
        formToggle.toggleForm(300);
        initialForm(e);
        submitForm(e);
    });

    $(manageBtn).on("click", function() {
        var itemBtn = $(".item-btns");
        $(itemBtn).toggleClass("active");
        formToggle.hideForm();
        manageBtnToggle.hideBtn();
        addBtnToggle.hideBtn();
        doneBtnToggle.showBtn();
    });
    
    $(doneBtn).on("click", function() {
        var itemBtn = $(".item-btns");
        $(itemBtn).removeClass("active");
        doneBtnToggle.hideBtn();
        manageBtnToggle.showBtn();
        addBtnToggle.showBtn();
    });
    
    manageBtnToggle.toggleBtn();
}

function noteBody() {
    /* ============================================================== */
    /* ALL EVENTS TO MANAGE NOTES CONTENT */
    /* ============================================================== */
    $(noteList).on("click", function(e) {
        var target = e.target;
        if( $(target).hasClass("delete-btn") ) {
            deleteNote(target);
        } else if( $(target).hasClass("edit-btn") ) {
            initialForm(target);
        }
    });
}

/* ============================================================== */
/*    TOGGLE FOR NOTE FORM */
/* ============================================================== */ 
var formToggle = {
    showForm: function() {
        $(noteForm).fadeIn(300);
    },
    hideForm: function() {
        $(noteForm).fadeOut(300);
    },
    toggleForm: function() {
        $(noteForm).fadeToggle(300);
    }
}

/* ============================================================== */
/*    TOGGLE FOR ADD BUTTON */
/* ============================================================== */ 
var addBtnToggle = {
    showBtn: function() {
        $(addBtn).show();
    },
    hideBtn: function() {
        $(addBtn).hide();
    }
}

/* ============================================================== */
/*    TOGGLE FOR MANAGING MANAGE BUTTON */
/* ============================================================== */ 
var manageBtnToggle = {
    showBtn: function() {
        $(manageBtn).show();
    },
    hideBtn: function() {
        $(manageBtn).hide();
    },
    toggleBtn: function() {
        if( $(noteList).empty() ) {
            $(manageBtn).hide();
        } else {
            $(manageBtn).show();
        }
    }
}

/* ============================================================== */
/*    TOGGLE FOR DONE BUTTON */
/* ============================================================== */ 
var doneBtnToggle = {
    showBtn: function() {
        $(doneBtn).show();
    },
    hideBtn: function() {
        $(doneBtn).hide();
    }
}
    
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
/*    ADD A NEW NOTE ELEMENT WITH PARAMETERS */
/* ============================================================== */
function addNote(id, title, category, introduction, syntax, description) {
    var newNote = new note(id, title, category, introduction, syntax, description);
    notes[noteID] = newNote;

    displayNote(newNote);
}

/* ============================================================== */
/* DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE */   
/* ============================================================== */
function displayNote(note) {
    var listItem, itemTop, itemBottom, itemHeader, itemTitle, itemCategory, itemIntroduction, itemSyntax, itemDescription, itembtns, itemDelete, itemDeleteBtn;
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

    $(noteList).append(listItem);
    itemBtns = $(".item-btns");
}

/* ============================================================== */
/* DELETE A NEW NOTE BASED ON THE ID */ 
/* ============================================================== */
function deleteNote(e) {
    var targetID = $(e).attr("id").slice(10);
    var r = confirm("Are You Sure You Want to Delete This Item?");
    if( r === true ) {
        $("#note"+targetID).remove();
        notes[targetID] = '';
    } else {
        return false;
    }
}
/* ============================================================== */
/* FUNCTIONS TO MANAGE THE FORM */   
/* ============================================================== */
function initialForm(e) {
    var title, category, introduction, syntax, description;
    var e = e.target;

    if( $(e).hasClass("add-btn") ) {
        title = $("#add-title").val('');
        category = $("#add-category").val('Category');
        introduction = $("#add-introduction").val('');
        syntax = syntaxEditor.activeFilter.editor.setData('');
        description = descriptionEditor.activeFilter.editor.setData('');
    } else if( $(e).hasClass("edit-btn") ) {
        var targetID = $(e).attr("id").slice(8);
        title = $("#add-title").val(notes[targetID].title);
        category = $("#add-category").val(notes[targetID].category);
        introduction = $("#add-introduction").val(notes[targetID].introduction);
        syntax = syntaxEditor.activeFilter.editor.setData(notes[targetID].syntax);
        description = descriptionEditor.activeFilter.editor.setData(notes[targetID].description);
    }
    formToggle.showForm();
}

function submitForm(e) {
    var target = e.target;
    if( $(target).hasClass("edit-btn") ) {
        $(formEl).on("submit", function(e) {
            
        });
    } else if( $(target).hasClass("add-btn") ) {
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

            manageBtnToggle.showBtn();
        });
    }
}