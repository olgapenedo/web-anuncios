var API_ENDPOINT = "https://6g367umhsl.execute-api.eu-west-1.amazonaws.com/dev/"

var setcomment= document.getElementById("setcomment");
var addcomment = document.getElementById("showcomment");

$(document).ready(function() {
    var adId = getUrlParameter('adId');
    $.ajax({
        url: API_ENDPOINT+"/advertisements/"+adId,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var data = response[0];
            console.log(response[0]);
            $('#adName').text('Nombre del anuncio: ' + data.nameAd);
            $('#adAuthor').text('Nombre del autor: ' + data.userId);
            $('#adDescription').text('Descripcion: ' + data.description);

            if (data.comments) {
                console.log(data.comments);
                for (var i = 0; i < data.comments.length; i++) {
                    $('#adComments').append($('<li>').text('Comentario ' + (i+1) + ': ' + data.comments[i]));
                }
            } else {
                $('#adComments').append($('<li>').text('No hay comentarios.'));
            }
        },
        error: function() {
            alert('Error al buscar ID');
        }
    });
    $('#sendcomment').click(function(event) {
    var adId = getUrlParameter('adId');
    var inputData = {
        "adId":adId,
         "comments":$('#comment').val()
        };
        console.log(inputData);
    $.ajax({
            url: API_ENDPOINT+"/advertisements/"+adId,
            type: 'POST',
            data:  JSON.stringify(inputData)  ,
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $('#commentSaved').show().text("Comentario publicado.");
                $('#comment').val('');
                $('#adComments').empty();
                $('#adName, #adAuthor, #adDescription').empty();
                addcomment.style.display = "none";
                setcomment.style.display ="block";
                $.ajax({
                    url: API_ENDPOINT+"/advertisements/"+adId,
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
                        var data = response[0];
                        console.log(response[0]);
                        $('#adName').text('Nombre del anuncio: ' + data.nameAd);
                        $('#adAuthor').text('Nombre del autor: ' + data.userId);
                        $('#adDescription').text('Descripción: ' + data.description);
            
                        if (data.comments) {
                            console.log(data.comments);
                            for (var i = 0; i < data.comments.length; i++) {
                                $('#adComments').append($('<li>').text('Comentario ' + (i+1) + ': ' + data.comments[i]));
                            }
                        } else {
                            $('#adComments').append($('<li>').text('No hay comentarios.'));
                        }
                    },
                    error: function() {
                        alert('Error al buscar ID');
                    }
                });
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
  $('#publishads').click(function(event) {
    $.ajax({
        success: function () {
            window.location.href = "index.html";
    }});
});
});

setcomment.addEventListener("click", function() {
  if (addcomment.style.display === "none") {
    addcomment.style.display = "block";
    $('#commentSaved').empty();
    setcomment.style.display ="none";
  } else {
    addcomment.style.display = "none";
  }
});




// Función para obtener un parámetro de consulta de la URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
