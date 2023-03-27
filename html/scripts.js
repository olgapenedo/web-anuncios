var API_ENDPOINT = "https://6g367umhsl.execute-api.eu-west-1.amazonaws.com/dev/"
//AJAX GET REQUEST
$(document).ready(function() {
  $('#saveads').click(function(event){
  var inputData = {
    "nameAd":$('#nameAd').val(),
        "userId":$('#userId').val(),
        "description":$('#description').val()
      };
  $.ajax({
        url: API_ENDPOINT,
        type: 'POST',
        data:  JSON.stringify(inputData)  ,
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
          document.getElementById("adsSaved").innerHTML = "Anuncio publicado";
          window.location.href = "ads.html";
        },
        error: function () {
            alert("error");
        }
    });
  });
    $('#seeads').click(function(event) {
      $.ajax({
          success: function () {
              window.location.href = "ads.html";
  }});
});
});

