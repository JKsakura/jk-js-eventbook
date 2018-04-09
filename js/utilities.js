
/* ============================================================== */
/*    VISUAL PART EVENTS  */
/* ============================================================== */
// TOGGLE FOR APP HEADER
var headerToggle = (function () {
    var header = $("#header");
    var menu = $("#main-menu");
    var toggle = $("#menu-toggle");
    return {
        menuToggle: function () {
            $(toggle).on("click", function () {
                $(header).toggleClass("open");
            });
        }
    };
}());

// TOGGLE FOR NOTE FORM
var formToggle = (function () {
    var formContainer = $("#note-form-container");
    return {
        showForm: function () {
            $(formContainer).addClass("show");
        },
        hideForm: function () {
            $(formContainer).removeClass("show");
        },
        toggleForm: function () {
            $(formContainer).toggleClass("show");
        }
    };
}());

var listToggle = (function () {
    var listContainer = $("#note-list-container");
    return {
        showList: function () {
            $(listContainer).removeClass("hide");
        },
        hideList: function () {
            $(listContainer).addClass("hide");
        },
        toggleList: function () {
            $(listContainer).toggleClass("hide");
        }
    };
}());

// TOGGLE FOR ADD BUTTON
var addBtnToggle = (function () {
    var addBtn = $("#note-add-btn");
    return {
        showBtn: function () {
            $(addBtn).show();
        },
        hideBtn: function () {
            $(addBtn).hide();
        }
    };
}());

// TOGGLE FOR CANCEL BUTTON
var cancelBtnToggle = (function () {
    var cancelBtn = $("#note-cancel-btn");
    return {
        showBtn: function () {
            $(cancelBtn).show();
        },
        hideBtn: function () {
            $(cancelBtn).hide();
        }
    };
}());

var detailToggle = (function () {
    var formContainer = $("#note-detail-container");
    return {
        showDetail: function () {
            $(formContainer).addClass("show");
        },
        hideDetail: function () {
            $(formContainer).removeClass("show");
        },
        toggleDetail: function () {
            $(formContainer).toggleClass("show");
        }
    };
}());