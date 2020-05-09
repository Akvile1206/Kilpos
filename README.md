# Kilpos 
#### *[kilpos] f pl* - loops

This is a snake-like javascript game to explore how hard/easy it is to imagine how curves will look like with various interpolation schemes. Playing this game you will see that some schemes make wild loop and you will die immediatly after eating an inoculous seeming dot. Try to advance through the levels or just draw a neat shape in each.

You can launch the game by starting a http server in the directory that you cloned the repository in. A simple node http server works just fine. Alternatively, you can just open `index.html` file in your browser.

#### Controls
* `a` key - move head counterclockwise
* `s` key - pause/unpause the game
* `d` key - move head clockwise
#### The rules
1. Eat red dots to grow bigger.
2. Try not to run into yourself or make loops.
3. Proceed to the next level when you feel like you have grown enough. 

### Featured curves
1. Overhauser Cubic AKA Bezier in disguise

![Overhauser snake](https://github.com/Akvile1206/Kilpos/blob/master/images/overhauser.png)

2. Bezier AKA Where did this loop come from!?

![Bezier snake](https://github.com/Akvile1206/Kilpos/blob/master/images/bezier.png)

3. B-Splines

![B-spline snake](https://github.com/Akvile1206/Kilpos/blob/master/images/b-splines.png?raw=true)

4. NURBS (dot radius corresponds to their weights)

![NURBS snake](https://github.com/Akvile1206/Kilpos/blob/master/images/nurbs.png)

5. Subdivision (Catmull-Clark)

![Subdivision snake](https://github.com/Akvile1206/Kilpos/blob/master/images/subdivision.png)
