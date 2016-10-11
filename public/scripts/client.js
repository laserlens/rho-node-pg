$(function () {

  getBooks();
  $('#book-form').on('submit', addBook());


});//end of jquery


function getBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: displayBooks
  });
}

function displayBooks(response) {
  console.log(response);
  var $list =('#book-list');
  $list.empty();
  response.forEach(function (books) {
    var $li = $('<li></li>');
    $li.append('<p><strong>' + books.title + '</strong></p>');
    $li.append('<p><em>'+ books.author + '</em></p>');
    $li.append('<p><time>'+ books.published + '</time></p>');
  });
}
function addbook(event) {
  event.preventDefault();

  var bookData = $(this).serialize();

  $.ajax({
    type:'POST',
    url:'/books',
    data: bookData,
    success: getBooks
  });
  $(this).find('input').val('');
}
