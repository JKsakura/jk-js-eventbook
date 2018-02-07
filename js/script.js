var formEl = document.getElementById("new-form");
var notes = [];
var noteID = 0;

formEl.addEventListener("submit", function(e) {
    e.preventDefault();
    var id, title, category, tag, syntax, description;
    id = noteID;
    title = document.getElementById("add-title").value;
    category = document.getElementById("add-category").value;
    introduction = document.getElementById("add-introduction").value;
    syntax = document.getElementById("add-syntax").value;
    description = document.getElementById("add-description").value;
    
    addNote(id, title, category, tag, syntax, description);
    noteID ++;
}, false);

function addNote(id, title, category, tag, syntax, description) {
    var newNote = new note(id, title, category, tag, syntax, description);
    notes.push(newNote);
    displayNote(newNote);
}

function note(id, title, category, tag, syntax, description) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.tag = tag;
    this.syntax = syntax;
    this.description = description;
}

function displayNote(note) {
    var list = document.getElementById("noteList");
    var listItem = document.createElement("li");
    var itemTop = document.createElement("div");
    var itemBottom = document.createElement("div");
    var itemHeader = document.createElement("div");
    var itemTitle = document.createElement("h4");
    var itemCategory = document.createElement("h5");
    var itemIntroduction = document.createElement("p");
    var itemSyntax = document.createElement("div");
    var itemDescription = document.createElement("div");
    var itemHeader = document.createElement("div");
    
    listItem.className = "list-item";
    itemTop.className = "item-top";
    itemBottom.className = "item-bottom";
    itemHeader.className = "item-header";
    itemTitle.className = "item-title";
    itemCategory.className = "item-category";
    itemIntroduction.className = "item-introduction";
    itemSyntax.className = "item-syntax";
    itemDescription.className = "item-description";
    itemHeader.className = "item-header";
    
    
    itemTitle.textContent = "item-title";
    itemCategory.textContent = "item-category";
    itemIntroduction.textContent = "item-introduction";
    itemSyntax.textContent = "item-syntax";
    itemDescription.textContent = "item-description";
    
    // ITEM TOP
    itemHeader.appendChild(itemTitle);
    itemHeader.appendChild(itemCategory);
    itemTop.appendChild(itemHeader);
    itemTop.appendChild(itemHeader);
    
    
    listItem.appendChild(itemHeader);
    
    list.appendChild(listItem);
}

// CALL THE FANCY WYSIWYG EDITOR
//CKEDITOR.replace( 'add-syntax' );
//CKEDITOR.replace( 'add-description' );