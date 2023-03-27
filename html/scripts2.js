var API_ENDPOINT = "https://6g367umhsl.execute-api.eu-west-1.amazonaws.com/dev/"
$(document).ready(function() {
    $.ajax({
          url: API_ENDPOINT+"advertisements",
          type: 'GET',
          contentType: 'application/json; charset=utf-8',
          success: function (response) {
            $('#adTable tr').slice(1).remove();
            jQuery.each(response, function(i,data) {          
              $("#adTable").append("<tr> \
                  <td>" + data['adId'] + "</td> \
                  <td>" + data['nameAd'] + "</td> \
                  <td>" + data['userId'] + "</td> \
                  </tr>");
            });
          },
          error: function () {
              alert("error");
          }
        });
    $('#searchForm').submit(function(event) {
      event.preventDefault(); // Evita que el formulario se envíe automáticamente

      var adId = $('#searchInput').val(); 

      window.location.href = "advertisement.html?adId=" + encodeURIComponent(adId);
    });
    $('#publishads').click(function(event) {
      $.ajax({
          success: function () {
              window.location.href = "index.html";
      }});
    });
    
  });
