$(function () {

  getBooks();
  $('#book-form').on('submit', addBook);
  $('#book-list').on('click','.remove',removeBook);
  $('#book-list').on('click', '.update', updateBook);

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
   var $list = $('#book-list');
   $list.empty();
   response.forEach(function(book) {
     var $li = $('<div id="listContainer"><ul></ul></div>');
     var $form = $('<form></form>');
     $form.append('<input type="text" name="title" value="' + book.title + '"/>');
     $form.append('<input type="text" name="author" value="' + book.author + '"/>');
     var date = new Date(book.published);
     $form.append('<input type="date" name="published" value="' + date.toISOString().slice(0,10) + '"/>');
     $form.append('<input type="text" name="edition" value="' + book.edition + '"/>');
     $form.append('<input type="text" name="publisher" value="' + book.publisher + '"/>');
     var $button = $('<button class="btn-default update">Update</button>');
     $button.data('id', book.id);
     $form.append($button);
     $form.append('<button class="btn-default remove" Type="button" id = '+book.id+'>Remove</button>');
     $li.append($form);
     $list.append($li);
   });
 }
 function addBook(event) {
    event.preventDefault();

    var bookData = $(this).serialize();
    console.log('whats the add book data', bookData);

    $.ajax({
      type: 'POST',
      url: '/books',
      data: bookData,
      success: getBooks
    });

  $(this).find('input').val('');
}
function removeBook(event) {
  event.preventDefault();
   var bookId = Number(this.id);
   console.log('whats the book id', bookId);
   $.ajax({
     type: 'DELETE',
     url: '/books',
     data: {'id':bookId},
     success: getBooks
   });
}
function updateBook() {
  event.preventDefault();
  var $button = $(this);
  console.log('whats update button', $button);
  var $form = $button.closest('form');
  console.log('whats update closest button', $form);

  var data = $form.serialize();
  console.log('whats the update data', data);
  $.ajax({
    type: 'PUT',
    url: '/books/' + $button.data('id'),
    data: data,
    success: getBooks
  });
}
