/* jshint camelcase: false */
/* globals L */

var NPMap = {
  div: 'map',
  homeControl: false,
  scrollWheelZoom: false
};

$.ajax({
  data: {
    q: 'SELECT full_designation, name, unit_code from parks WHERE unit_code IS NOT NULL ORDER BY name'
  },
  success: function(data) {
    var $info = $('.bg-info'),
      $map = $('#map'),
      $park = $('#parks'),
      $poi = $('#points-of-interest'),
      $properties = $('#properties'),
      first = true,
      options = '<option value="none">Choose a park...</option>',
      marker, results;

    function clearMarker() {
      if (marker) {
        NPMap.config.L.removeLayer(marker);
        marker = null;
      }
    }
    function sort(arr) {
      var a, b, a1, b1, rx=/(\d+)|(\D+)/g, rd=/\d+/;

      return arr.sort(function(as, bs){
        a = String(as).toLowerCase().match(rx);
        b = String(bs).toLowerCase().match(rx);

        while(a.length && b.length){
          a1 = a.shift();
          b1 = b.shift();

          if(rd.test(a1) || rd.test(b1)){
            if (!rd.test(a1)) {
              return 1;
            }

            if (!rd.test(b1)) {
              return -1;
            }

            if (a1 != b1) {
              return a1 - b1;
            }
          } else if (a1 != b1) {
            return a1> b1? 1: -1;
          }
        }

        return a.length- b.length;
      });
    }

    $.each(data.rows, function(i, park) {
      options += '<option value="' + park.unit_code.toLowerCase() + '">' + park.name + ' ' + park.full_designation + '</option>';
    });
    $park
      .html(options)
      .change(function() {
        var $this = $(this);

        if (first) {
          $this.children('option:first').remove();
          first = false;
        } else {
          //$('input').typeahead('destroy');
          $poi.html(null);
          $map.hide();
          clearMarker();
          $poi.val(null);
          $properties
            .hide()
            .html(null);
        }

        $info.html('<div style="text-align:center;">Loading...</div>');
        $.ajax({
          data: {
            unit_code: $this.val()
          },
          error: function(error) {
            if (error.status === 404) {
              $info.html('This park has 0 points of interest in Places.');
            } else {
              $info.html('There was an error getting the park\'s points of interest.');
            }
          },
          success: function(data) {
            var count = 0,
              opts = {};

            results = {};

            $.each(data.features, function(i, feature) {
              var category = feature.properties['nps:fcat'],
                coordinates = feature.geometry.coordinates,
                id = feature.properties['nps:places_id'],
                name = feature.properties.name || 'Unnamed',
                obj = {};

              if (category) {
                if (!opts[category]) {
                  opts[feature.properties['nps:fcat']] = [];
                }

                opts[category].push({
                  id: id,
                  name: name
                });
              } else {
                if (!opts.Uncategorized) {
                  opts.Uncategorized = [];
                }

                opts.Uncategorized.push({
                  id: id,
                  name: name
                });
              }

              $.extend(obj, feature.properties);
              obj.lat = coordinates[1];
              obj.lng = coordinates[0];
              results[obj['nps:places_id']] = obj;
              count++;
            });
            $info.html('This park has ' + count + ' points of interest in Places.');

            if (count > 0) {
              var html = '';

              $.each(opts, function(key, value) {
                html += '<optgroup label="' + key + '">';

                value = sort(value);
                $.each(value, function(i, obj) {
                  html += '<option value="' + obj.id + '">' + obj.name + '</option>';
                });

                html += '</optgroup>';
              });
              $poi.html(html);
              $poi.trigger('change');
            }
          },
          url: 'http://inpniscvplaces1/api/data/points.geojson'
        });
      });
    $poi.change(function() {
      var result = results[$(this).val()],
        latLng = {
          lat: result.lat,
          lng: result.lng
        },
        properties = $.extend({}, result);

      delete properties.concatenated;
      delete properties.lat;
      delete properties.lng;
      clearMarker();
      NPMap.config.L.setView(latLng, (NPMap.config.L.getZoom() > 15 ? NPMap.config.L.getZoom() : 15));
      marker = L.marker(latLng).addTo(NPMap.config.L);
      $map.show();
      $properties
        .html(JSON.stringify(properties, null, 2))
        .show();
      NPMap.config.L.invalidateSize();
    });
  },
  url: 'https://nps.cartodb.com/api/v2/sql'
});
