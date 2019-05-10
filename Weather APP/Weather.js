$(document).on("mobileinit", function () {
  //weather
  $(function () {

    var superciudad = [];
    let nuevaciudad;

    /* Page A1 init*/
    $("#A1").on("pageinit", function () {
      navigator.geolocation.getCurrentPosition(getWeather);
    });

    ///Muestra el tiempo
    function getWeather(position) {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;

      let weatherAPI = "http://api.openweathermap.org/data/2.5/weather?lat="
        + lat +
        "&lon="
        + long +
        "&lang=es&units=metric&APPID=da0c69b1272a93f87322f3a600b667ea";
      let forecast = "http://api.openweathermap.org/data/2.5/forecast?lat="
        + lat +
        "&lon="
        + long +
        "&lang=es&units=metric&APPID=da0c69b1272a93f87322f3a600b667ea";
      $.getJSON(weatherAPI, function (response) {
        $("#grad")
          .append("<p>" + response.main.temp + " ºC" + "</p>");
        $("#location")
          .append("<p>" + response.name + ", " + response.sys.country + "</p>");
        $("#weat")
          .append('<img src =' + "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png" + '>');
        $("#weat")
          .append("<p>" + response.weather[0].description + "</p>");
        $("#hum")
          .append("<p>" + "Humedad " + response.main.humidity + "%" + "</p>");
        $("#win")
          .append("<p>" + "Viento " + response.wind.speed + "m/s" + "</p>");
      });
      $.getJSON(forecast, function (b) {
        $("#fore")
          .append("<p>" + b.list[0].main.temp + "ºC // " + b.list[1].main.temp + "ºC</p>");
      });
    };

    ///Permite hacer swipe.
    $(document).on('swipeleft', '.ui-page', function (event) {
      let nextpage = $.mobile.activePage.next('[data-role="page"]');
      if (nextpage.length > 0) {
        $.mobile.changePage(nextpage, { transition: "slide", reverse: false }, true, true);
      }
    });
    $(document).on('swiperight', '.ui-page', function (event) {
      let prevpage = $(this).prev('[data-role="page"]');
      if (prevpage.length > 0) {
        $.mobile.changePage(prevpage, { transition: "slide", reverse: true }, true, true);
      }
    });

    /* Page A2 init */
    $("#A2").on("pageinit", function () {
      ///Añadir ciudades.
      if (JSON.parse(localStorage.getItem("superciudad"))) {
        superciudad = JSON.parse(localStorage.getItem("superciudad"));

///Pintar el localstorage y eliminarlo.
        $.each(superciudad, function (i, value) {
          let indo = "http://api.openweathermap.org/data/2.5/weather?q=" + superciudad[i] + "&lang=es&units=metric&APPID=da0c69b1272a93f87322f3a600b667ea";
          $.getJSON(indo, function (response) {
            let nuevaciudad = "<div class='tarjeta'><p>" + superciudad[i] + "&nbsp;&nbsp;&nbsp;//&nbsp;&nbsp;&nbsp;" + response.main.temp + " ºC" + "</p><button class='boton'>X</button></div>";
            $("#select").append(nuevaciudad);
            $(".boton").on("click", function (event) {
              $(this).parent().remove();
              superciudad.splice(superciudad.indexOf(this), 1);
              localStorage.setItem("superciudad", JSON.stringify(superciudad));
            });
          });
        });
      }

      $(document).on("click", ".ciudad", function () {
        if (JSON.parse(localStorage.getItem("superciudad"))) {
          superciudad = JSON.parse(localStorage.getItem("superciudad"));
        }

        let elem = $(this).find("ui-btn").context.innerText;

        superciudad.push(elem);
        localStorage.setItem("superciudad", JSON.stringify(superciudad));


        let indi = "http://api.openweathermap.org/data/2.5/weather?q=" + elem + "&lang=es&units=metric&APPID=da0c69b1272a93f87322f3a600b667ea";
        $.getJSON(indi, function (response) {
          let ciuda = "<div class='tarjeta'><p>" + elem + "&nbsp;&nbsp;&nbsp;//&nbsp;&nbsp;&nbsp;" + response.main.temp + " ºC" + "</p><button class='boton'>X</button></div>";
          $("#select").append(ciuda);
          $(".boton").on("click", function () {
            $(this).parent().remove();
          });
        });
      });

      //AUTOCOMPLETAR
      $("#autocomplete").on("filterablebeforefilter", function (e, data) {
        let $ul = $(this),
          $input = $(data.input),
          value = $input.val(),
          html = "";
        $ul.html("");
        if (value && value.length > 2) {
          $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
          $ul.listview("refresh");
          $.ajax({
            url: "http://gd.geobytes.com/AutoCompleteCity",
            dataType: "jsonp",
            crossDomain: true,
            data: {
              q: $input.val()
            }
          })
            .then(function (response) {
              $.each(response, function (i, val) {
                html += "<li class='ciudad'><a href='#'> " + val + "</a></li>";
              });
              $ul.html(html);
              $ul.listview("refresh");
              $ul.trigger("updatelayout");
            });
        }
      });
    });
  });
});