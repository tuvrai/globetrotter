# globetrotter
Game playable in browser, where you need to indicate on the world map the location of given place. It is based on the classic flash game and in honor for it is now playable in HTML5 canvas.

## Origins
It is based on a flash game Globetrotter XL. Unfortunately, now this game is not as easy to play and it needed some refreshment anyway. My goal is to provide a neat HTML5 application, which might be useful for teaching geography with fun.

## Gameplay
In the game, we need to click as close as we can to given location. The closer we are, the more points we get. There is also time limit for every location which depends on level and the quicker we are, the more points we get for the time also.

Game has 10 levels, each with some random locations (starting from 3 at the first level, 4 at the second and so on up to 10th level with 12 locations), taken from list of over 100 locations, which are mostly capital cities of the world.

We have a map in Robinson projection (the old flash game uses Mercator projection, which actually might be a better choice, as the land mass is bigger on it, but for some reason I dived into Robinson one, which is totally ok also). It has outlined states of the world. From the level 7 though, the borders dissapear and we end up with a plain map of the world.

Every level has a threshold of points we need to get in the level. If we fail, we lose. If we win, we go to the next level, eventually winning the game after completing all locations in 10th level and getting enough points.

## Instructions
### Scroll wheel ###
Allows zooming in / out the map

### R ###
Resests the zoom
