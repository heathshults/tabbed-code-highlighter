'use strict';
$(document).ready(() => {
  // toggle search panel visibility
  $('#fkTrigger').click(function () {
    $('#searchPanel').toggleClass('on')
  })
  // perform search on enter keypress
  $('#searchTxt').keyup(function () {

    // send search text to api
    var searchTxt = $('#searchTxt').val()
    var expression = new RegExp(searchTxt, 'i')
    var searchState = $('#state').val('')
    $.getJSON('/data/site-content.json', function (data) {
      $.each(data, function (key, value) {
        // if(value.description.search(expression) != -1 || value.body.search(expression) != -1) {
        if (value.content.search(expression) != -1) {
          $('#result').append('<div class="fk-megaSearch__item"><h3><a href="' + value.uri + '">' +
          value.uri + '</a></h3><small>' + value.updatedAt + '</small><p>' + value.content +
              '</p><p><a href="' + value.uri + '">Go to page...</a></p></div>')
        }
      })
    })

  })
  $('#result').on('click', 'div', function () {
    var click_text = $(this).text().split('|');
    $('#txtSearch').val($.trim(click_text[0]));
    $('#result').html('');
  });
});
// window.onload = function () {
//   var searchTxt = document.getElementById('txtSearch'),
//     searchTxtVal = searchTxt.value,
//     searchPanel = document.getElementById('searchPanel'),
//     result = document.getElementById('result').innerHTML,
//     trigger = document.getElementById('FKTrigger')
  
//   // searchBox.onclick = function () {
//   //   searchPanel.classList.toggle('is-active')
    
//   // }
//   searchTxt.onkeyup = function () {
          
//     // send search text to api
//     searchPanel.classList.toggle('is-active')
//     let expression = new RegExp(searchTxtVal, 'i')    
//     let searchState = $('#state').val('')
//     $.getJSON('/data/framekitDB.json', function (data) {
//       $.each(data, function (key, value) {
//         // if(value.description.search(expression) != -1 || value.body.search(expression) != -1) {
//         if (value.description.search(expression) != -1 || value.body.search(expression) != -1) {
//           $('#result').append('<div class="fk-megaSearch__item"><h3><a href="' + value.path + '">' +
//               value.pageTitle + '</a></h3><small>' + value.updatedAt + '</small><p>' + value.description +
//               '</p><p><a href="' + value.path + '">Go to page...</a></p></div>')
//         }
//       })
//     })

//   }

// }
