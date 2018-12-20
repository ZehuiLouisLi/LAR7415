// Global variables
var mapCenter = [-122.422, 37.757];
var mapZoom = 12.25;

// Initialize map
mapboxgl.accessToken = 'pk.eyJ1IjoibG91aXNsaSIsImEiOiJjam9oeTQ2YzIwM2g0M3ZtdmVzZmpud2c5In0.-khzLVM94QkcvEHWQ40-xg'; 
var map = new mapboxgl.Map({
	container: 'map', // this is the ID of the div in index.html where the map should go
    center: mapCenter, // set the centerpoint of the map programatically. Note that this is [longitude, latitude]!
    zoom: mapZoom, // set the default zoom programatically
	style: 'mapbox://styles/louisli/cjohycsqw0huz2rlbc6n42frz', 
	customAttribution: 'San Francisco Open Data (https://datasf.org/)', 
});

// Show modal when About button is clicked
$("#about").on('click', function() { // Click event handler for the About button in jQuery, see https://api.jquery.com/click/
    $("#screen").fadeToggle(); // shows/hides the black screen behind modal, see https://api.jquery.com/fadeToggle/
    $(".modal").fadeToggle(); // shows/hides the modal itself, see https://api.jquery.com/fadeToggle/
});

$(".modal>.close-button").on('click', function() { // Click event handler for the modal's close button
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});

// Legend
var layers = [ // an array of the possible values you want to show in your legend
    'Landmarks',
    'Hillshade',
    'Water',
    'Motorway',
    'Parks',
    
];

var colors = [ // an array of the color values for each legend item
    '#ffffff',
    '#blad8b',
    '#40507d',
    '#454545',
    '#c1cdc3'
    
];

// for loop to create individual legend items
for (i=0; i<layers.length; i++) {
    var layer =layers[i]; // name of the current legend item, from the layers array
    var color =colors[i]; // color value of the current legend item, from the colors array 
    
    var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; // create the HTML for the legend element to be added
    var item = $(itemHTML).appendTo("#legend"); // add the legend item to the legend
    var legendKey = $(item).find(".legend-key"); // find the legend key (colored circle) for the current item
    legendKey.css("background", color); // change the background color of the legend key
}

// 10.25 starts here----------------------------------------------
// 
// INFO WINDOW CODE 

    map.on('mousemove', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. 

        var parks = map.queryRenderedFeatures(e.point, {    
            layers: ['cville-parks']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel). For more info on queryRenderedFeatures, see the example at https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/. Documentation at https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures.
        });
              
        if (parks.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state

            $('#info-window-body').html('<h3><strong>' + parks[0].properties.PARKNAME + '</strong></h3><p>' + parks[0].properties.PARK_TYPE + ' PARK</p><img class="park-image" src="img/' + parks[0].properties.PARKNAME + '.jpg">');

        } else {    // what shows up in the info window if you are NOT hovering over a park

            $('#info-window-body').html('<p>Hover over a park or click on a bus stop to learn more about it.');
            
        }

    });

// POPUPS CODE

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map

      var stops = map.queryRenderedFeatures(e.point, {  // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['cville-bus-stops']    // replace this with the name of the layer from the Mapbox Studio layers panel
    });

      // if the layer is empty, this if statement will exit the function (no popups created) -- this is a failsafe to avoid non-functioning popups
      if (stops.length == 0) {
        return;
    }

    // Initiate the popup
    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -15] // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
    });

      // Set the popup location based on each feature
      popup.setLngLat(stops[0].geometry.coordinates);

      // Set the contents of the popup window
      popup.setHTML('<h3>Stop ID: ' + stops[0].properties.stop_id + '</h3><p>' + stops[0].properties.stop_name + '</p>');
            // stops[0].properties.stop_id will become the title of the popup (<h3> element)
            // stops[0].properties.stop_name will become the body of the popup


        // popup.setHTML('<p>' + stops[0].properties.stop_name + '</p>')
        

      // Add the popup to the map 
      popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
  });


// 11.01 starts here----------------------------------------------

// SHOW/HIDE LAYERS
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['San Francisco Seismic', '<i class="fas fa-exclamation"></i>&nbsp;San Francisco Seismic Area'],                      // layers[0]
        ['parks', '<i class="fas fa-tree"></i>&nbsp;Public Parks'],                              // layers[1][1] = 'Parks'
        ['Airport', '<i class="fas fa-plane-departure"></i>&nbsp;Airport'],     
        ['Green Wave Streets', '<i class="fas fa-bicycle"></i>&nbsp;Green Wave Street'],
        ['Landmark Districts', '<i class="fas fa-landmark"></i>&nbsp;Landmark Districts'],
        ['Building Footprint', '<i class="fas fa-home"></i>&nbsp;Building Footprint'],
        ['background', 'Map background']
    ]; 

    // functions to perform when map loads
    map.on('load', function () {
        
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
        }

        // show/hide layers when button is clicked
        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;

                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
        });
    });


// CHANGE LAYER STYLE
// Refer to example at https://www.mapbox.com/mapbox-gl-js/example/color-switcher/
    
    var swatches = $("#swatches");

    var colors = [  // an array of color options for the bus stop ponts
        '#2e3640',
        '#d6ebf',
    ]; 

    var layer = 'cville-bus-stops';

    colors.forEach(function(color) {
        var swatch = $("<button class='swatch'></button>").appendTo(swatches);

        $(swatch).css('background-color', color); 

        $(swatch).on('click', function() {
            map.setPaintProperty(layer, 'circle-color', color); // 'circle-color' is a property specific to a circle layer. Read more about what values to use for different style properties and different types of layers at https://www.mapbox.com/mapbox-gl-js/style-spec/#layers
        });

        $(swatches).append(swatch);
    });

// 11.08 starts here----------------------------------------------
// SCROLL TO ZOOM THROUGH SITES
    
    // A JavaScript object containing all of the data for each site "chapter" (the sites to zoom to while scrolling)
    var chapters = {
        'darden-towe': {
            name: "Ferry Building",
            description: "The San Francisco Ferry Building is a terminal for ferries that travel across the San Francisco Bay, a food hall and an office building. It is located on The Embarcadero in San Francisco, California. On top of the building is a 245-foot-tall (75 m) clock tower with four clock dials, each 22 feet (6.7 m) in diameter, which can be seen from Market Street, a main thoroughfare of the city.",
            imagepath: "img/Ferry Building.jpg",
            bearing: 0,
            center: [ -122.392, 37.795],
            zoom: 17.59,
            pitch: 60
        },
        'mcguffey-park': {
            name: "Union Square",
            description: "Union Square is a 2.6-acre public plaza bordered by Geary, Powell, Post and Stockton Streets in downtown San Francisco, California. Union Square also refers to the central shopping, hotel, and theater district that surrounds the plaza for several blocks. The area got its name because it was once used for Thomas Starr King rallies and support for the Union Army during the American Civil War, earning its designation as a CaliforniaHistorical Landmark.Today, this one-block plaza and surrounding area is one of the largest collections of department stores, upscale boutiques, gift shops, artgalleries, and beauty salons in the United States, making Union Square a major tourist destination and a vital, cosmopolitan gathering place in downtown San Francisco. Grand hotels and small inns, as well as repertory, off-Broadway, and single-act theaters also contribute to the area's dynamic, 24-hour character.",
            imagepath: "img/Union Square.jpg",
            bearing: 0,
            center: [ -122.406, 37.788],
            zoom: 17.96,
            pitch: 0
        },
        'mcintire-park': {
            name: "Green Wave Streets",
            description: "n 2010, San Francisco added the first two-way “green wave” in the world to Valencia Street, one of our city’s busiest biking routes. On a green wave, lights are timed at bike speed, allowing people to pedal comfortably along busy bike routes, and slowing down car traffic on busy streets.",
            imagepath: "img/Green Wave.jpg",
            bearing: 20,
            center: [ -122.412, 37.755],
            zoom: 17.43,
            pitch: 50
        }
       
    };

    console.log(chapters['darden-towe']['name']);
    console.log(Object.keys(chapters)[0]);

    // Add the chapters to the #chapters div on the webpage
    for (var key in chapters) {
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h3>" + chapters[key]['name'] + "</h3><img src='" + chapters[key]['imagepath'] + "'><p>" + chapters[key]['description'] + "</p>").appendTo(newChapter);
    }


    $("#chapters").scroll(function(e) {

        var chapterNames = Object.keys(chapters);

        for (var i = 0; i < chapterNames.length; i++) {

            var chapterName = chapterNames[i];
            var chapterElem = $("#" + chapterName);

            if (chapterElem.length) {

                if (checkInView($("#chapters"), chapterElem, true)) {
                    setActiveChapter(chapterName);
                    $("#" + chapterName).addClass('active');

                    break;

                } else {
                    $("#" + chapterName).removeClass('active');
                }
            }
        }
    });

    var activeChapterName = '';
    
    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;

        map.flyTo(chapters[chapterName]);

        activeChapterName = chapterName;
    }

    function checkInView(container, elem, partial) {
        var contHeight = container.height();
        var contTop = container.scrollTop();
        var contBottom = contTop + contHeight ;

        var elemTop = $(elem).offset().top - container.offset().top;
        var elemBottom = elemTop + $(elem).height();


        var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
        var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

        return  isTotal  || isPart ;
    }


// ADD GEOJSON DATA (static layers)

    // See example at https://www.mapbox.com/mapbox-gl-js/example/live-geojson/
    var staticUrl = 'https://opendata.arcgis.com/datasets/edaeb963c9464edeb14fea9c7f0135e3_11.geojson';
    map.on('load', function () {
        window.setInterval(function() { // window.setInterval allows you to repeat a task on a time interval. See https://www.w3schools.com/jsref/met_win_setinterval.asp
            console.log();
            map.getSource('polling-places').setData(staticUrl);
        }, 2000); // 2000 is in milliseconds, so every 2 seconds. Change this number as needed but be aware that more frequent requests will be more processor-intensive, expecially for large datasets.
        
        map.addSource('polling-places', { type: 'geojson', data: staticUrl });
        map.addLayer({
            "id": "polling-places",
            "type": "symbol",
            "source": "polling-places",
            "layout": {
                "icon-image": "embassy-15"
            }
        });
    });

// 12.06 starts here----------------------------------------------
// RESET MAP BUTTON
    
    $("#reset").click(function() {
        map.setCenter(mapCenter);
        map.setZoom(mapZoom);
        map.setPitch(0);
        map.setBearing(0);
        map.setFilter("cville-building-permits", null); // reset building permits filters
        
        // Reset all layers to visible
        for (i=0; i<layers.length; i++) {
            map.setLayoutProperty(layers[i][0], 'visibility', 'visible'); 
            $("#" + layers[i][0]).addClass('active');
        }                   

    });

// Timeline labels using d3

    var width = 500;
    var height = 25;
    var marginLeft = 15;
    var marginRight = 15;

    var data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    // Append SVG 
    var svg = d3.select("#timeline-labels")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    // Create scale
    var scale = d3.scaleLinear()
                  .domain([d3.min(data), d3.max(data)])
                  .range([marginLeft, width-marginRight]); 

    // Add scales to axis
    var x_axis = d3.axisBottom()
                   .scale(scale)
                   .tickFormat(d3.format("d"));  // Formats number as a date, e.g. 2008 instead of 2,008 

    //Append group and insert axis
    svg.append("g")
       .call(x_axis);

// Timeline map filter (timeline of building permit issue dates)
    
    // Create array of  dates from Mapbox layer (in this case, Charlottesville Building Permit application dates)
    map.on('load', function () {

        // Get all data from a layer using queryRenderedFeatures
        var permits = map.queryRenderedFeatures(null, { // when you send "null" as the first argument, queryRenderedFeatures will return ALL of the features in the specified layers
            layers: ["cville-building-permits"]
        });

        var permitDatesArray = [];
        var permitYearsArray = [];

        // push the values for a certain property to the variable declared above (e.g. push the permit dates to a permit date array)
        for (i=0; i<permits.length; i++) {
            var permitDate = permits[i].properties.AppliedDat;
            // The format of the date in this layer is a long string in the format "2012-10-19T04:00:00.000Z", and we are just looking for the 4-digit year, so the following line will trim each value in the array to just the first 4 characters.
            var permitYear = permitDate.substring(0, 4);
            
            permitDatesArray.push(permitDate);    // Replace "AppliedDat" with the field you want to use for the timeline slider
            permitYearsArray.push(permitYear);
        }

        // Create event listener for when the slider with id="timeslider" is moved
        $("#timeslider").change(function(e) {
            var year = this.value; 
            var indices = [];

            // Find the indices in the permitDatesArray array where the year from the time slider matches the year of the permit application
            var matches = permitDatesArray.filter(function(item, i){
                if (item.indexOf(year) >= 0) {
                    indices.push(i);
                }
            });

            // create filter 
            var newFilters = ["any"];
            
            for (i=0; i<indices.length; i++) {
                var filter = ["==","AppliedDat", permitDatesArray[indices[i]]];
                newFilters.push(filter);
            }

            map.setFilter("cville-building-permits", newFilters);
        });

    });
