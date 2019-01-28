
// Adding Plus and Minus :)
$(document).on('click', '#plus', function(e) {
    e.preventDefault();
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseInt($('quantity').val());

    priceValue += parseFloat($('#priceHidden').val());
    quantity += 1;

    $('#quantity').val(quantity);
    $('priceValue').val(priceValue.toFixed(2));
    $('total').html(quantity);
});

$(document).on('click', '#minus', function(e){
    e.preventDefault();
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseInt($('quantity').val());

    if( quantity == 1) {
        priceValue = $('priceHidden').val();
        quantity = 1;
    } else {
        priceValue -= parseFloat($('priceHidden').val());
        quantity -= 1;
    }

    $('#quantity').val(quantity);
    $('priceValue').val(priceValue.toFixed(2));
    $('total').html(quantity);
});

