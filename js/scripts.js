$(function () {

    //Animate scroll to ancor
    $('.ancor').on('click', function (e) {
        e.preventDefault();
        var self = $(this),
            ancor = self.attr('href'),
            ancorPos = $(ancor).position().top;
        if (ancor === "#portfolio")
            $('html,body').animate({ scrollTop: ancorPos - 100 }, 500);
        else $('html,body').animate({ scrollTop: ancorPos }, 500);
    });

    //Sticky Nav
    var sticky = new Waypoint.Sticky({
        element: document.getElementById('nav')
    });

    //Handle active ancors
    var sections = $('section');
    var downpx;

    sections.each(function () {

        new Waypoint.Inview({
            element: this,
            enter: function (direction) {
                if (direction === "down") {
                    handleAncors(this.element);
                }
            }, exit: function (direction) {
                if (direction === "up") {
                    handleAncors(this.element);
                }
            }
        })

    });

});



function handleAncors(elem) {
    $('.ancor').removeClass('active');
    $('.ancor[href="#' + elem.id + '"]').addClass('active');
}

