var $my_card = $('#my-card');

$my_card.attr({
    'data-deck': 'main_deck',
    'data-rank': 'rank_4',
    'data-suit': 'hearts'
});
$my_card.find('.card-front').css('background-image', 'url("/img/cards/cards/01_bang.png")');

$my_card.css('transform', 'rotateY(180deg)');
var rotation = 0;
setInterval(_ => {
    $my_card.css('transform', `rotateY(${rotation}deg)`);
    rotation += 1;
}, 1000 / 60);