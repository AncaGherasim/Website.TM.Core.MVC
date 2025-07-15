var isNumber = /[0-9]+/g;
$(document).ready(function () {
    $(".dvTabTitle").click(function () {
        filterList(this.id);
    });
    $(".liLink").click(function () {
        selectCntry(this.id);
    });
    filterList('243');
    
});

function filterList(id) {
    $('.dvTabTitle').each(function () {
        id == this.id ? $(this).addClass("activeTab") : $(this).removeClass("activeTab");
    });
    $('ul[id^="ctr"], ul[id^="cyt"]').each(function () {
        id == this.id.match(isNumber) ? $(this).slideDown() : $(this).slideUp();
    });
    selectCntry(-1);
};

function selectCntry(id) {
    id == -1 ? $('.ctyLink').slideDown() :
        (
            $('.ctyLink').each(function () {
                id == this.id.match(isNumber) ? $(this).slideDown() : $(this).slideUp();
            })
        );
};
