$(function() {

    var quickTicker = $('#ticker').quickTicker({
        duration: 5000,
        spacing: 50,
        pauseOnHover: true,
        allowDuplicates: false
    }).data('quickTicker');

    var items = [
        "#define true false;",
        "<b>I'm bold!</b> <i>I'm italic</i> And I'm normal :(",
        "Fezzes are cool.",
        "Here's a <a href='http://www.reddit.com/' target='_blank'>link</a>. I support html content too!",
        "Developers! Developers! Developers!"
    ];
    
    $('#addMessage').click(function(e) {
        var content = items[Math.floor(Math.random() * items.length)];
        quickTicker.add(content);
    });
});