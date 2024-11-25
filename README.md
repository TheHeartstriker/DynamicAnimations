Dynamic Animations

Description and usage
This is a canvas and react project leveraging a heavy use of logic to create dynamic and in some cases interactable animations.
The main goal is for someone to have fun messing around with the project and its respective animations (: In the case that a moniter is not being used
it can be a great thing to just leave running on the side.

Link
https://www.dynamicanimations.com
How its done
Rain

Droplets
The rain is draw with a gradient according to the background to give a fade effect but its basically simply a line
which is given x1, x2, y1, y2 values. I also store data in a object that contains info for each droplet we changes the x and y in the main loop
to move it downwards there is also other varbles for example speed which is the constantly applyed gravity and sheet which decides the length(y value) of the droplet
it give it a defined amount of sizes the goal was to create an illusion of distance
Lightning
The main loop draws a single line every iteration with a random(but controled) off set as the lightnings life cycle gets closer to ending it
also has a roughness which if used with the distance can make the lightning less smooth or more so its designed to be very custimzable with many import 'magic number' to play with
Wind
There is less to say about this its a constant offset applyed in the droplet loop which pushes the droplets to the right it also adds a slight tilt to the droplets giving it more real feal

Sand
This is based of the idea of a pixel array which is imposes a grid or matrix on to the screen with the length and amount of col and rows being defined by the
pixel size that we define along with screen size. Each point or pixel has two main values 1 or 0 and hue to make the sand 'fall' we see if the element bellow is empty aka 0 if so we make the current grid element 0
and the one bellow 1 and we iterate through the pixel array and if a grid element is 1 we draw it. And thats pretty much it thats how it works at a basic level pretty simple yeah? Anyway there
is more nuance like making it a hue rather than a simple 1 or 0 but thats the basics.

Stars
Bassically its just an animation that draws balls... (insert unporfesional joke here). This was in a way the first thing I ever made code wise I dont like tuturials much so I knew pretty much nothing I tried creating it in css at first... Anyway
its based on a simple current and target possition and a speed method for getting there (linear or lerp) then when it gets close enough it gets a new target. I also implmented a gravity mode but its limited
by the browser and my knowledge so I will add more info when thats done or imporved

Particles
This is a play ground for particles I made a fire animation that is inspired by well fire. And it just makes more particles closer to the center and less farther away using a gasean random.
The next is a Point Bassically a circle at the center of the screen where particles can appear the goal was to make it look like a sun but the browser can only handle so many particles.
But it still looks cool it fills an array with a amount of valid points in which we randomly pick one and the particle can appear there and the valid points is an array or circle in the center of the screen
