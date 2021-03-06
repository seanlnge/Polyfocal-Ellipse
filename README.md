# [Polyfocal Ellipse](https://htmlpreview.github.io/?https://github.com/seanlnge/polyfocal-ellipse/blob/main/index.html)
***
Precalculus class has recently introduced me to the wonders of conic sections, specifically the ellipse. An ellipse is practically an elongated circle, however with some extra special properties, most of which involve the two foci dropped into the middle. The foci are hugely important for one reason, the fact that [for any point on the perimeter of the ellipse, the sums of the distances between that point and the foci are constant](https://en.wikipedia.org/wiki/Ellipse#Definition_as_locus_of_points). After exploring the idea of having 2 focal points instead of a puny single one like in a circle, I got distracted by the mere thought of 3 focal points, or 4; in fact, what would a shape look like given it had `n` focal points. I decided to devote my afternoon to the topic, which intrigued me enough to turn it into two afternoons.

After a bit of research, I figured out that finding an equation or set of points to interpolate between that fit the criteria was, as we know so far, impossible. Unfortunate, however I had already figured out a get-around. Considering I am not going to brute force through every point within a large range, approximation was the way to go. The method I decided on was to approximate the center of the polyellipse, then go out into each direction from the center and find the distance at that angle that best approximated the polyellipse's focal constant. This method needed two things, a way to find the center, and a way to find the most optimal distance at a given angle.

My method of finding the center of the foci was just to average out the x-values and the y-values. Unfortunately this had some major drawbacks, so much so that I had to switch to approximating the geometric median instead. It didn't come until chronologically later in my thought process, however, after I realized the issue.

The method I used to find the most optimal distance at a given angle was the [Newton-Raphson](https://en.wikipedia.org/wiki/Newton%27s_method) method. The Newton-Raphson method is a way to find the roots or zeroes of a function, and thankfully is extremely efficient when dealing with parabolic shapes. To make use of this method, I would need to find a way to benefit from obtaining the zeroes of a function. The way I did this was to create something in machine learning known as an error function. An error function is a function that scores a given input `x` based on how close some function `f(x)` was to an expected output. If I were to make an error function that is exactly `0` when plugging in a distance `n`, I would be able to use the Newton-Raphson method to approximate where that zero is, giving me the most optimal distance of `n`.

The error function I decided upon was `(foci distances - polyellipse's constant) ^ 2`. This would give a parabolic shape, which allows the Newton-Raphson method to work as efficiently as possible. The thing I was not looking forward to however was implementing this. The Newton-Raphson method works by taking a starting value `x`, a function `f`, and iterating the instruction `x := x - f(x)/f'(x)` as many times as wanted. The equation `f(x) = (distances - constant)^2` is hilariously trivial, however. The real equation taking into account the angle and the distance from the center looks like this:

![lagrida_latex_editor (1)](https://user-images.githubusercontent.com/42986319/162105319-b90982d7-61f4-44b3-82f3-eec4dae8452a.png)

After fully writing that down onto my notebook, I noticed the amount of effort that would have to go into differentiating this. Fortunately however, I had a study hall in 5th period, so I could afford to take my time. After 2 entire notebook pages, I came up with this:

![image](https://user-images.githubusercontent.com/42986319/162106203-bc6130cd-60e8-4f93-b4b8-17cbba16052c.png)

Hell of an equation.

After a bit of meandering through equations I had the tools necessary to create this polyellipse. I wrote up some code to draw out the ellipse onto a browser canvas, and it all looked good. Added a couple of sliders to change the constant as well as the number of foci, and realized I had found a bit of an issue.

![image](https://user-images.githubusercontent.com/42986319/162106881-47b52f09-586c-4429-8623-33531604af32.png)

What is happening here is that sometimes the most optimal distance in a certain direction is negative due to the center not being exact, which I never accounted for. I learnt that the center of the polyellipse isn't in the average of the points as I had thought, but the Fermat-Torricelli point in the convex polygon made by the foci. The Fermat-Torricelli point is the point inside of a polygon where the sum of the distances to each vertex is at it's minimum, which goes hand in hand with the definition of a polyellipse. In fact, the sum of the distances to each vertex from the Fermat-Torricelli point is the minimum possible constant that a polyellipse can have.

This seemed like an easy fix, however for any polygon with a vertex count > 4, there is no way to calculate that point exactly. No problem, I'll just approximate it. Unfortunately however, there is no trivial way of doing this. To find the geometric median point, I would need to approximate a point in `R^2`, which means that I had to deal with optimizing two variables at once. Although I am not very accustomed in multi-variable calculus, I am fortunate enough to have engulfed myself in the basics of machine-learning techniques 7 months prior. If I were to use the Newton-Raphson method over each variable, and then tweak the amount moved by some constant, then over enough iterations it would approach a minimum.

I am not able to use the Newton-Raphson method just yet, as it only finds zeroes, and I'm not trying to find where a constant is equal to zero. Since the geometric median is at a critical point in all directions, I would be able to use the Newton-Raphson method to find where the derivative was equal to zero. This means that instead of the instruction being `x := x - f(x, y)/(df/dx)`, I would need to differentiate both `f(x, y)`, and `df/dx`, making the instruction `x := x - df*d^2f/dx^3` instead. A concern I had here is that converging towards a minimum does not necessarily imply a global minimum, however in further research I learned that there was only one critical point. Another couple of rounds of derivation later with the function `f(x, y) = sum(sqrt((x-c_x)^2 sqrt(y-c_y)^2)`, I got:

![lagrida_latex_editor (7)](https://user-images.githubusercontent.com/42986319/162328563-2104af79-79a9-4ec2-8f4f-adfd8c1480dd.png)

![lagrida_latex_editor (9)](https://user-images.githubusercontent.com/42986319/162328828-0c9aab80-17a5-4d2c-b77e-a2b4203cb870.png)


