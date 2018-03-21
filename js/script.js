jQuery(funciton($) {
    detailTitle = $("#detail-title");
    detailIntroduction = $("#detail-introduction");
    detailCategory = $("#detail-category");
    detailSyntax = $("#detail-syntax");
    detailDescription = $("#detail-description");


});
// DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE
function displayDetail(note) {
    $(detailTitle).text(note.title);
    $(detailCategory).text(note.category);
    $(detailIntroduction).text(note.introduction);
    $(detailSyntax).html(note.syntax);
    $(detailDescription).html(note.description);
}
