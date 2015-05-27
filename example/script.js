$(function() {

    var quickTicker = $('#ticker').quickTicker({
        duration: 5000,
        spacing: 50,
        pauseOnHover: true,
        allowDuplicates: true
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

    $('#pauseTicker').click(function(e) {
        quickTicker.pause();
    });

    $('#resumeTicker').click(function(e) {
        quickTicker.resume();
    });

    // setTimeout(function() {
    //     quickTicker.pause();

    //     setTimeout(function() {
    //         quickTicker.resume();
    //     }, 3000);
    // }, 3000);
});