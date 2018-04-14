
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

// TOGGLE FOR Page
var pageToggle = {
    pageForward: function(page1, page2) {
        $(page1).addClass("hide");
        $(page2).addClass("active");
        $(page2).animate({
            scrollTop: 0
        }, 0);
    },
    pageBackward: function(page1, page2) {
        $(page1).removeClass("hide");
        $(page2).removeClass("active");
        $(page1).animate({
            scrollTop: 0
        }, 0);
    }
}

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