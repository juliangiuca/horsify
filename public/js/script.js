var changeImage;

$(function () {
  var img     = $('#img');
  var spinner = $('#spin');

  img.load(function () {
    spinner.hide();
    img.show();
  });

  changeImage = function () {
    var url = $('#url').val();

    img.hide();
    spinner.show();
    img.attr('src', '/fetch/' + url);

  };
});
