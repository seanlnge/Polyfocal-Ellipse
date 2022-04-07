# Polyfocal Ellipse
***
Precalculus class has recently introduced me to the wonders of conic sections, specifically the ellipse. An ellipse is practically an elongated circle, however with some extra special properties, most of which involve the two foci dropped into the middle. The foci are hugely important for one reason, the fact that [for any point on the perimeter of the ellipse, the sums of the distances between that point and the foci are constant](https://en.wikipedia.org/wiki/Ellipse#Definition_as_locus_of_points). After exploring the idea of having 2 focal points instead of a puny single one like in a circle, I got distracted by the mere thought of 3 focal points, or 4; in fact, what would a shape look like given it had `n` focal points. I decided to devote my afternoon to the topic, which intrigued me enough to turn it into two afternoons.

After a bit of research, I figured out that finding an equation or set of points to interpolate between that fit the criteria was, as we know so far, impossible. Unfortunate, however I had already figured out a get-around. Considering I am not going to brute force through every point within a large range, approximation was the way to go. The method I decided on was to approximate the center of the polyellipse, then go out into each direction from the center and find the distance at that angle that best approximated the polyellipse's focal constant. This method needed two things, a way to find the center, and a way to find the most optimal distance at a given angle.

My method of finding the center of the foci was just to average out the x-values and the y-values. Unfortunately this had some major drawbacks, so much so that I had to switch to approximating the Fermat-Torricelli point instead. We'll review that later, as it didn't come until chronologically later in my thought process.

The method I used to find the most optimal distance at a given angle was the [Newton-Raphson](https://en.wikipedia.org/wiki/Newton%27s_method) method. The Newton-Raphson method is a way to find the roots or zeroes of a function, and thankfully is extremely efficient when dealing with parabolic shapes. To make use of this method, I would need to find a way to benefit from obtaining the zeroes of a function. The way I did this was to create something in machine learning known as an error function. An error function is a function that scores a given input `x` based on how close some function `f(x)` was to an expected output. If I were to make an error function that is exactly `0` when plugging in a distance `n`, I would be able to use the Newton-Raphson method to approximate where that zero is, giving me the most optimal distance of `n`.

The error function I decided upon was `(foci distances - polyellipse's constant) ^ 2`. This would give a parabolic shape, which allows the Newton-Raphson method to work as efficiently as possible. The thing I was not looking forward to however was implementing this. The Newton-Raphson method works by taking a starting value `x`, a function `f`, and iterating the instruction `x := x - f(x)/f'(x)` as many times as wanted. The equation `f(x) = (distances - constant)^2` is hilariously trivial, however. The real equation taking into account the angle and the distance from the center looks like this:

![lagrida_latex_editor (1)](https://user-images.githubusercontent.com/42986319/162105319-b90982d7-61f4-44b3-82f3-eec4dae8452a.png)

After fully writing that down onto my notebook, I noticed the amount of effort that would have to go into differentiating this. Fortunately however, I had a study hall in 5th period, so I could afford to take my time. After 2 entire notebook pages, I came up with this:

![image](https://user-images.githubusercontent.com/42986319/162106203-bc6130cd-60e8-4f93-b4b8-17cbba16052c.png)

Hell of an equation.

After a bit of meandering through equations I had the tools necessary to create this polyellipse. I wrote up some code to draw out the ellipse onto a browser canvas, and it all looked good. Added a couple of sliders to change the constant as well as the number of foci, and realized I had found a bit of an issue.

