var changeImage;

$(function () {

  var img     = $('#img');
  var spinner = $('#spin');
  var orient  = $('select.form-control');

  img.load(function () {
    spinner.hide();
    img.show();
  });

  changeImage = function () {
    var url    = $('#url').val();
    var o = orient.val();

    img.hide();
    spinner.show();
    img.attr('src', '/fetch/' + o.toLowerCase() + '/' + url);
  };
});
