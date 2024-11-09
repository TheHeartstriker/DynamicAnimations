Dynamic Animations

Description and usage
This is a canvas and react project leveraging a heavy use of logic to create dynamic and in some cases interactable animations.
The main goal is for someone to have fun messing around with the project and its respective animations. In the case that a moniter is not being used
it can be a great thing to just leave running on the side

Link

How its done
Rain

Droplets
The rain is draw with a gradient according to the background to give a fade effect but its basically simply a line
which is given x1, x2, y1, y2 values. I also store data in a object that contains info for each droplet we changes the x and y in the main loop
to move it downwards there is also other varbles for example speed which is the constantly applyed gravity and sheet which decides the length(y value) of the droplet
it give it a defined amount of sizes the goal was to create an illusion of distance
Lightning
The main loop draws a single line every iteration with a random(but controled) off set which accordding decress as the lightnings life cycle gets closer to ending it
also has a roughness which if used with the distance can make the lightning less smooth or more so its designed to be very custimzable
Wind
There is less to say about this its a constant offset applyed in the droplet loop which pushes the droplets to the right it also adds a slight tilt to the droplets giving it more real feal

Sand
This is based of the idea of a pixel array which is imposes a grid or matrix on to the screen with the length and amount of col and rows being defined by the
pixel size that we define. Each point or pixel has two main values 1 or 0 and hue to make the sand 'fall' we see if the element bellow is empty aka 0 if so we make the current grid element 0
and the one bellow 1 and we iterate through the pixel array and if a grid element is 1 we draw it based of its hue. And thats pretty much it thats how it works at a basic level pretty simple yeah? Anyway this
is more nuance but thats the basics

Stars
Bassically its just an animation that draws balls... (insert unporfesional joke here). This was in a way the first thing I ever made code wise first in js not react I tried with css at first... Anyway
its based on a simple current and target possition and a speed method for getting there (linear or lerp) then when it gets close enough it gets a new target. I also implmented a gravity mode but its limited
by the browser so I will add more info when thats done

Particles
This is a played ground for particles
