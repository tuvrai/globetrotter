# globetrotter
Game playable in browser, where you need to indicate on the world map the location of given place. It is based on the classic flash game and in honor for it is now playable in HTML5 canvas.

## Origins
It is based on a flash game _Globetrotter XL_. [Here's the gameplay](https://www.youtube.com/watch?v=zd8Ka2Hzst0) (With quite good score BTW). Unfortunately, now this game is not as easy to play and it needed some refreshment anyway. 

My goal is to provide a neat HTML5 application, which might be useful for teaching geography with fun.

## Gameplay
In the game, we need to click as close as we can to given location. The closer we are, the more points we get. There is also time limit for every location which depends on level and the quicker we are, the more points we get for the time also.

Game has 10 levels, each with some random locations (starting from 3 at the first level, 4 at the second and so on up to 10th level with 12 locations), taken from list of over 300 locations, including all capitals of the world.

We have a map in Robinson projection (the old flash game uses Mercator projection, which actually might be a better choice, as the land mass is bigger on it, but for some reason I dived into Robinson one, which is totally ok also). It has outlined states of the world. From the level 7 though, the borders dissapear and we end up with a plain map of the world.
The source of the map is [here](http://alabamamaps.ua.edu/contemporarymaps/world/world/index.html).

Every level has a threshold of points we need to get in the level. If we don't get enought points, we lose. If we win, we go to the next level, eventually winning the game after completing all locations in 10th level and getting enough points.

## Instructions
To play the game, just clone or download this repository and open _main.html_ file in browser.
Soon it will be available in the internet also.

### Scroll wheel ###
Allows zooming in / out the map

### R ###
Resests the zoom to starting depth.<br>
*Note*: zoom resets everytime on it's own after clicking _next_ button.

### Enter ###
Moves to next location, after a guess (does the same as _next_ button)

## Custom locations
Feel free to add your own locations. Just add new target in the `loadTargets` function, with particular data - name, country, region, latitude and longitude values of the location.

To get the coordinates of the particular location, just click wherever it is on google maps and read the latitude and longitude. The game's smallest unit is 0.25 degree (around 28 km), so you might need to round it a little bit.

If you have coordinates in degree / minutes notation, you can still convert it to numerical. For example, the location of 25 degree and 47 minutes north is 25.7833 (25 + 47/60), so we can round it to 25.75.

The southern hemisphere latitude is written with negative, for example 25.5 south is simply -25.5. Same goes with western hempisphere longitude. North hemisphere latitude and eastern hemisphere longitude is positive.
The hemisphere of the point is determined by whether it is above or down to equator and whether it is left or right to prime meridian.

## TODO
* Mobile version support
* Allow choosing locations (like only capitals from North America or only places from Oceania etc.)
* Show some trivia about guessed location
* Allow loading custom locations (from GUI or JSON string)
* Maybe music, just like the flash version had
