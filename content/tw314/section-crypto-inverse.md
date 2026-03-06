---
title: "Inverses in finite groups"
shell: tw314-native
sort_order: 37
---

<div class="tw314-native-document" data-tw314-slug="section-crypto-inverse">
<div id="content" class="pretext-content"><section class="section" id="section-crypto-inverse"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">6.3</span> <span class="title">Inverses in finite groups</span>
</h2>
<p id="p-388">To find a more efficient way of calculating a discrete logarithm, we first need to find a way to determine the inverse of an element in a group. To this extent we make use of the <dfn class="terminology">Extended Euclidean Algorithm</dfn> which is an extention of Euclid's algorithm for determining the greatest common divisor of two numbers.</p>
<article class="algorithm theorem-like" id="algorithm-5"><h6 class="heading">
<span class="type">Algorithm</span><span class="space"> </span><span class="codenumber">6.3.1</span><span class="period">.</span><span class="space"> </span><span class="title">Euclid's algorithm for computing GCD.</span>
</h6>
<p id="p-389"></p>
<p id="p-390"><em class="alert">Input:</em> Two non-negative integers \(a\) and \(b\) with \(a\geq b\text{.}\)</p>
<p id="p-391"><em class="alert">Output:</em> The greatest common divisor of \(a\) and \(b\text{.}\)</p>
<p id="p-392">WHILE \(b\neq 0\text{:}\)</p>
<ol class="decimal">
<li id="li-99">\(\displaystyle r=a \pmod b\)</li>
<li id="li-100">\(\displaystyle a=b\)</li>
<li id="li-101">\(\displaystyle b=r\)</li>
</ol>
<p id="p-393">RETURN \(a\)</p></article><p id="p-394">Simply put \(\text{GCD}(a,b)=\text{GCD}(b,a\pmod b)\text{.}\)</p>
<article class="example example-like" id="example-crypto-gcd"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">6.3.2</span><span class="period">.</span><span class="space"> </span><span class="title">Euclidean algorithm.</span>
</h6>Calculate \(\text{GCD}(4864,3458)\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-31"><div class="solution solution-like">
<p id="p-395">Initialize the algorithm with \(a=4864\) and \(b=3458\text{.}\)</p>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(a\)</td>
<td class="c m b1 r1 l0 t0 lines">\(b\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(r\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(4864\)</td>
<td class="c m b0 r1 l0 t0 lines">\(3458\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(4864\pmod{3458}=1406\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(3458\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1406\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(3458\pmod{1406}=646\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(1406\)</td>
<td class="c m b0 r1 l0 t0 lines">\(646\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1406\pmod{646}=114\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(646\)</td>
<td class="c m b0 r1 l0 t0 lines">\(114\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(646\pmod{114}=76\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(114\)</td>
<td class="c m b0 r1 l0 t0 lines">\(76\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(114\pmod{76}=38\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(76\)</td>
<td class="c m b0 r1 l0 t0 lines">\(38\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(76\pmod{38}=0\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(38\)</td>
<td class="c m b0 r1 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell"></td>
</tr>
</table></div></div></div>
<p id="p-396">Hence \(\text{GCD}(4864,3458)=38\text{.}\)</p>
</div></div>
</div></article><p id="p-397">With the extended Euclidean algorithm we can find two integers \(x\) and \(y\) such that \(ax+by=d\) for any non-negative integers \(a\) and \(b\) with \(a\geq b\text{.}\)</p>
<article class="algorithm theorem-like" id="algorithm-6"><h6 class="heading">
<span class="type">Algorithm</span><span class="space"> </span><span class="codenumber">6.3.3</span><span class="period">.</span><span class="space"> </span><span class="title">The Extended Euclidean algorithm.</span>
</h6>
<p id="p-398"></p>
<p id="p-399"><em class="alert">Input:</em> Two non-negative integers \(a\) and \(b\) with \(a\geq b\text{.}\)</p>
<p id="p-400"><em class="alert">Output:</em> \(d=\text{GCD}(a,b)\) and integers \(x,y\) satisfying \(ax+by=d\text{.}\)</p>
<p id="p-401">Set \(r_0=a, r_1=b, x_0=y_1=1, x_1=y_0=0\)</p>
<p id="p-402">WHILE \(r_i\neq 0\text{:}\)</p>
<ol class="decimal">
<li id="li-102">\(\displaystyle i=i+1\)</li>
<li id="li-103">\(\displaystyle q_i=\left\lfloor\frac{r_{i-2}}{r_{i-1}}\right\rfloor\)</li>
<li id="li-104">\(\displaystyle r_i=r_{i-2}-q_ir_{i-1}\)</li>
<li id="li-105">\(\displaystyle x_i=x_{i-2}-q_ix_{i-1}\)</li>
<li id="li-106">\(\displaystyle y_i=y_{i-2}-q_iy_{i-1}\)</li>
</ol>
<p id="p-403">RETURN \(d=r_{i-1}, x=x_{i-1}, y=y_{i-1}\)</p></article><p id="p-404">Note that for any \(i\) we have \(r_{i}=ax_i+by_i\text{.}\)</p>
<article class="example example-like" id="example-crypto-eea"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">6.3.4</span><span class="period">.</span><span class="space"> </span><span class="title">The extended Euclidean algorithm.</span>
</h6>Use the extended Euclidean algorithm to calculate \(d,x,y\) when \(a=29\) and \(b=11\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-32"><div class="solution solution-like">
<p id="p-405">Initialize the algorithm with \(r_0=29, r_1=11, x_0=y_1=1, x_1=y_0=0\text{.}\)</p>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(q_i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(r_i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(x_i\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(y_i\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(0\)</td>
<td class="c m b0 r1 l0 t0 lines"></td>
<td class="c m b0 r1 l0 t0 lines">\(29\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(0\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r1 l0 t0 lines"></td>
<td class="c m b0 r1 l0 t0 lines">\(11\)</td>
<td class="c m b0 r1 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(2\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor 29/11\rfloor=2\)</td>
<td class="c m b0 r1 l0 t0 lines">\(29-2\times 11=7\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1-2\times 0=1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(0-2\times 1=-2\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(3\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor 11/7\rfloor=1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(11-1\times 7=4\)</td>
<td class="c m b0 r1 l0 t0 lines">\(0-1\times 1=-1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1-1\times (-2)=3\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(4\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor 7/4\rfloor=1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(7-1\times 4=3\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1-1\times (-1)=2\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(-2-1\times 3=-5\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(5\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor 4/3\rfloor=1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(4-1\times 3=1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(-1-1\times 2=-3\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(3-1\times (-5)=8\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(6\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor 3/1\rfloor=3\)</td>
<td class="c m b0 r1 l0 t0 lines">\(3-3\times 1=0\)</td>
<td class="c m b0 r1 l0 t0 lines">\(2-3\times (-3)=11\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(-5-3\times 8=-29\)</td>
</tr>
</table></div></div></div>
<p id="p-406">Hence \(29\times (-3)+11\times 8=1\) and \(d=1\text{,}\) \(x=-3\) and \(y=8\text{.}\)</p>
</div></div>
</div></article><p id="p-407">We can use the extended Euclidean algorithm to calculate the inverse of any element in \(\mathbf{F}^*_p\) for \(p\) prime.</p>
<p id="p-408">Let \(b\in \mathbf{F}^*_p\text{.}\) Since \(p\) is prime, it follows that \(\text{GCD}(b,p)=1\text{.}\) Therefore, the extende Euclidean algorithm will yield \(x\) and \(y\) such that \(px+by=1\text{.}\) Furthermore, since \(px=0\pmod p\) it follows that \(by=1\pmod p\) and so \(b^{-1}=y\text{.}\)</p>
<article class="example example-like" id="example-crypto-inverse"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">6.3.5</span><span class="period">.</span><span class="space"> </span><span class="title">Inverses.</span>
</h6>Calculate the inverse of \(94\in \mathbf{F}^*_{257}\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-33"><div class="solution solution-like">
<p id="p-409">To calculate the inverse of 94, we initialize the extended Euclidean algorithm with \(r_0=257, r_1=94, x_0=y_1=1, x_1=y_0=0\text{.}\)</p>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(q_i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(r_i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(x_i\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(y_i\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(0\)</td>
<td class="c m b0 r1 l0 t0 lines"></td>
<td class="c m b0 r1 l0 t0 lines">\(257\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(0\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r1 l0 t0 lines"></td>
<td class="c m b0 r1 l0 t0 lines">\(94\)</td>
<td class="c m b0 r1 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(2\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor 257/94\rfloor=2\)</td>
<td class="c m b0 r1 l0 t0 lines">\(257-2\times 94=69\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1-2\times 0=1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(0-2\times 1=-2\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(3\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor 94/69\rfloor=1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(94-1\times 69=25\)</td>
<td class="c m b0 r1 l0 t0 lines">\(0-1\times 1=-1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1-1\times (-2)=3\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(4\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor 69/25\rfloor=2\)</td>
<td class="c m b0 r1 l0 t0 lines">\(69-2\times 25=19\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1-2\times (-1)=3\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(-2-2\times 3=-8\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(5\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor 25/19\rfloor=1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(25-1\times 19=6\)</td>
<td class="c m b0 r1 l0 t0 lines">\(-1-1\times 3=-4\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(3-1\times (-8)=11\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(6\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor 19/6\rfloor=3\)</td>
<td class="c m b0 r1 l0 t0 lines">\(19-3\times 6=1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(3-3\times (-4)=15\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(-8-3\times 11=-41\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(7\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor 6/1\rfloor=6\)</td>
<td class="c m b0 r1 l0 t0 lines">\(6-6\times 1=0\)</td>
<td class="c m b0 r1 l0 t0 lines">\(-4-6\times 15=-94\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(11-6\times (-41)=257\)</td>
</tr>
</table></div></div></div>
<p id="p-410">Hence \(257\times 15+94\times (-41)=1\) and \(94^{-1}=-41=216 \pmod{257}\text{.}\)</p>
</div></div>
</div></article><p id="p-411">The extended Euclidean algorithm can also be used to find the inverse of polynomials in the finite field \(\mathbf{F}_n[x]/f(x)\text{.}\)</p>
<article class="example example-like" id="example-crypto-polyinverse"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">6.3.6</span><span class="period">.</span><span class="space"> </span><span class="title">Inverses.</span>
</h6>Calculate the inverse of \(x^3+x^2+1\in \mathbf{F}_2[x]/(x^4+x+1)\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-34"><div class="solution solution-like">
<p id="p-412">To calculate the inverse of \(x^3+x^2+1\text{,}\) we initialize the extended Euclidean algorithm with \(r_0=x^4+x+1, r_1=x^3+x^2+1, x_0=y_1=1, x_1=y_0=0\text{.}\)</p>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(q_i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(r_i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(x_i\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(y_i\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(0\)</td>
<td class="c m b0 r1 l0 t0 lines"></td>
<td class="c m b0 r1 l0 t0 lines">\(x^4+x+1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(0\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r1 l0 t0 lines"></td>
<td class="c m b0 r1 l0 t0 lines">\(x^3+x^2+1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(2\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor r_0/r_1\rfloor=x+1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(r_0-(x+1)\times r_1=x^2\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1-(x+1)\times 0=1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(0-(x+1)\times 1=x+1\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(3\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor r_1/r_2\rfloor=x+1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(r_1-(x+1)\times r_2=1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(0-(x+1)\times 1=x+1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1-(x+1)\times (x+1)=x^2\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(4\)</td>
<td class="c m b0 r1 l0 t0 lines">\(\lfloor r_2/r_3\rfloor=x^2\)</td>
<td class="c m b0 r1 l0 t0 lines">\(r_2-x^2\times r_3=0\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1-x^2\times (x+1)=x^3+x^2+1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(x+1-x^2\times x^2=x^4+x+1\)</td>
</tr>
</table></div></div></div>
<p id="p-413">Hence the inverse of \(x^3+x^2+1\) is \(x^2\text{.}\)</p>
</div></div>
</div></article></section></div>
</div>
